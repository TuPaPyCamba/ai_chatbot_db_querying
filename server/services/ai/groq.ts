import OpenAI from 'openai';
import { executeReadOnlyQuery } from "../database/db";

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

const SYSTEM_PROMPT = `You are a Senior Financial Analyst and Database Chatbot. You have access to a local PostgreSQL database containing investment portfolio data.
Use the tool 'execute_sql_query' to fetch the necessary data to answer the user's questions.

Below is the database schema:

assets: id (uuid), ticker (varchar), type (varchar), name (varchar), sector (varchar).
transactions: id (uuid), asset_id (uuid FK), transaction_type (varchar), quantity (decimal), unit_price (decimal), date (date).
dividends_paid: id (uuid), asset_id (uuid FK), amount_per_share (decimal), payment_date (date).

CRITICAL RULES:
1. Always formulate valid PostgreSQL queries.
2. If the user asks a question requiring database values, call the 'execute_sql_query' tool.
3. Do not invent any numbers; base your answers strictly on the retrieved database results.
4. If a query returns a PostgreSQL error, review the error message, fix your SQL query, and run it again.
5. In your final natural language response, state clearly what data was found. Format tables and values cleanly.

IMPORTANT INSTRUCTIONS FOR TOOL CALLING:
You are interacting with a standardized API. If you need to query the database, you MUST use the native JSON tool-calling capabilities provided by the API.

UNDER NO CIRCUMSTANCES should you output raw text tags like \`<function=execute_sql_query>\` or \`</function>\`.

Do not write out the tool call in plain text. Just invoke the tool natively. Confirm once you have updated the System Prompt text.
`;

export type MessageRole = "user" | "assistant" | "system" | "tool";

export interface ChatMessage {
  role: MessageRole;
  content: string | null;
  name?: string;
  tool_call_id?: string;
  tool_calls?: unknown[];
}

/**
 * Handles the conversational loop with tool calling for SQL generation and execution.
 */
export async function chatConDatos(messageHistory: ChatMessage[]): Promise<string> {
  const model = process.env.GROQ_MODEL || "llama3-70b-8192";

  // Build the message sequence starting with the system prompt
  const apiMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...messageHistory.map((msg) => {
      if (msg.role === "system") {
        return {
          role: "system",
          content: msg.content || "",
          ...(msg.name ? { name: msg.name } : {}),
        } as OpenAI.Chat.Completions.ChatCompletionSystemMessageParam;
      } else if (msg.role === "user") {
        return {
          role: "user",
          content: msg.content || "",
          ...(msg.name ? { name: msg.name } : {}),
        } as OpenAI.Chat.Completions.ChatCompletionUserMessageParam;
      } else if (msg.role === "assistant") {
        return {
          role: "assistant",
          content: msg.content || undefined,
          ...(msg.name ? { name: msg.name } : {}),
          ...(msg.tool_calls
            ? { tool_calls: msg.tool_calls as OpenAI.Chat.Completions.ChatCompletionMessageToolCall[] }
            : {}),
        } as OpenAI.Chat.Completions.ChatCompletionAssistantMessageParam;
      } else {
        return {
          role: "tool",
          content: msg.content || "",
          tool_call_id: msg.tool_call_id || "",
        } as OpenAI.Chat.Completions.ChatCompletionToolMessageParam;
      }
    }),
  ];

  let loopCount = 0;
  const maxLoops = 5;

  while (loopCount < maxLoops) {
    loopCount++;
    try {
      const response = await openai.chat.completions.create({
        model,
        messages: apiMessages,
        tools: [
          {
            type: "function",
            function: {
              name: "execute_sql_query",
              description: "Executes a read-only SELECT query against the investment database. Use this to fetch transactions, assets, and dividends.",
              parameters: {
                type: "object",
                properties: {
                  query: {
                    type: "string",
                    description: "The raw PostgreSQL SELECT query to run. Example: SELECT * FROM assets LIMIT 5;",
                  },
                },
                required: ["query"],
              },
            },
          },
        ],
        tool_choice: "auto",
      });

      const responseMessage = response.choices[0].message;

      // Append assistant's response to message history
      apiMessages.push(responseMessage);

      // Check if LLM requested a tool call
      const toolCalls = responseMessage.tool_calls;

      if (!toolCalls || toolCalls.length === 0) {
        // No tool calls requested, return the final text response
        return responseMessage.content || "";
      }

      // Execute requested tool calls
      for (const toolCall of toolCalls) {
        if (toolCall.type === "function" && toolCall.function?.name === "execute_sql_query") {
          let args: { query: string };
          try {
            args = JSON.parse(toolCall.function.arguments);
          } catch {
            args = { query: toolCall.function.arguments };
          }

          const sqlQuery = args.query;
          console.log(`[AI-TOOL] Executing SQL Query: ${sqlQuery}`);

          // Execute read-only query
          const queryResult = await executeReadOnlyQuery(sqlQuery);

          // Append tool result message
          apiMessages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: queryResult,
          });
        }
      }
    } catch (error: unknown) {
      console.error("Error in AI tool-calling loop:", error);
      throw error;
    }
  }

  throw new Error("Maximum tool calling loop iteration reached without final response.");
}

// Maintain compatibility with legacy imports
export const chatWithData = chatConDatos;
