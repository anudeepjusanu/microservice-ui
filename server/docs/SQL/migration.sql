
ALTER TABLE PRESENTATION.PENDINGAPPROVALATTRIBUTE RENAME COLUMN GOLDENACCOUNTNUMBER TO GOLDEN_ACCOUNT_ID;
ALTER TABLE PRESENTATION.PENDINGAPPROVALATTRIBUTE ALTER GOLDEN_ACCOUNT_ID SET DATA TYPE NUMBER(38,0);