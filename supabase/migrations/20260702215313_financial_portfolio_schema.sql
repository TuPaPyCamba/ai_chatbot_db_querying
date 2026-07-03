-- Investment portfolio schema

CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticker VARCHAR(50) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL, -- e.g., ETF, REIT, Stock
    name VARCHAR(255) NOT NULL,
    sector VARCHAR(255) NOT NULL
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    transaction_type VARCHAR(10) NOT NULL CHECK (transaction_type IN ('BUY', 'SELL')),
    quantity NUMERIC(16, 6) NOT NULL,
    unit_price NUMERIC(16, 4) NOT NULL,
    date DATE NOT NULL
);

CREATE TABLE dividends_paid (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    amount_per_share NUMERIC(16, 6) NOT NULL,
    payment_date DATE NOT NULL
);
