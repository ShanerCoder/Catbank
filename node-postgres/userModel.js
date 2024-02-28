require("dotenv").config();
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const algorithm = "aes-256-ctr";
const secretKey = process.env.SECRET_KEY || generateRandomKey();
const IV_LENGTH = 16;

const Pool = require("pg").Pool;
const pool = new Pool({
  user: "catBankUser",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "catbank",
  password: process.env.DB_PASSWORD || "password",
  port: process.env.POOL_PORT || 5432,
});

const getAllAccounts = async () => {
  try {
    return await new Promise(function (resolve, reject) {
      pool.query("SELECT * FROM accounts", (error, results) => {
        if (error) {
          reject(error);
        }
        if (results && results.rows) {
          resolve(results.rows);
        } else {
          reject(new Error("No results found"));
        }
      });
    });
  } catch (error) {
    console.error(error);
    throw new Error("Internal server error");
  }
};

const registerUser = async (body) => {
  try {
    const { accountNumber, password } = body;
    const silveuroCount = process.env.SILVEURO_PROMOTION || 0;
    const encryptedPassword = await bcrypt.hash(password, 10);
    const encryptedSilveuroCount = await encryptValue(silveuroCount);

    return await new Promise(function (resolve, reject) {
      pool.query(
        'INSERT INTO accounts ("accountNumber", "password", "silveuros") VALUES ($1, $2, $3) RETURNING *',
        [accountNumber, encryptedPassword, encryptedSilveuroCount],
        (error, results) => {
          if (results && results.rows) {
            const user = results.rows[0];
            user.silveuros = decryptValue(user.silveuros);
            delete user.password;
            resolve(user);
          }
          if (error) {
            reject(error);
          } else {
            reject(new Error("No results found"));
          }
        }
      );
    });
  } catch (error) {
    console.error(error);
    throw new Error("Internal server error");
  }
};

const authenticateUser = async (body) => {
  try {
    const { accountNumber, password } = body;
    const user = await validateUser(accountNumber, password);
    const userTransactions = await getTransactionHistory(accountNumber);
    user.transactions = userTransactions;
    return user;
  } catch (error) {
    console.error(error);
    throw new Error("Internal server error");
  }
};

const sendSilveuroToUser = async (body) => {
  try {
    const { otherUserAccountNumber, amountToSend, accountNumber, password } =
      body;
    let user;
    let otherUser;
    try {
      user = await validateUser(accountNumber, password);
    } catch (error) {
      reject(new Error("Invalid account number or password"));
    }
    try {
      otherUser = await getUser(otherUserAccountNumber);
    } catch (error) {
      reject(new Error("Other user not found"));
    }

    const newBalance = user.silveuros - amountToSend;
    const encryptedNewBalance = await encryptValue(String(newBalance));
    const newOtherUserBalance =
      Number(otherUser.silveuros) + Number(amountToSend);
    const encryptedNewOtherUserBalance = await encryptValue(
      String(newOtherUserBalance)
    );

    await new Promise(function (resolve, reject) {
      pool.query(
        `
          UPDATE accounts
          SET "silveuros" =
            CASE
              WHEN "accountNumber" = $1 THEN $2
              WHEN "accountNumber" = $3 THEN $4
              ELSE "silveuros"
            END
          WHERE "accountNumber" IN ($1, $3)
        `,
        [
          accountNumber,
          encryptedNewBalance,
          otherUserAccountNumber,
          encryptedNewOtherUserBalance,
        ],
        (error, results) => {
          if (error) {
            reject(error);
          }
          if (results && results.rows) {
            resolve(true);
          } else {
            reject(new Error("No results found"));
          }
        }
      );
    });
    const transaction = {
      accountNumberSentFrom: accountNumber,
      accountNumberSentTo: otherUserAccountNumber,
      amountSent: amountToSend,
    };
    const transactionWritten = await writeTransaction(transaction);
    if (!transactionWritten) return new Error("Failed to write transaction");
    const userTransactions = await getTransactionHistory(accountNumber);
    user.silveuros = newBalance;
    user.transactions = userTransactions;
    return user;
  } catch (error) {
    console.error(error);
    throw new Error("Internal server error");
  }
};

const getUser = async (accountNumber) => {
  return await new Promise(function (resolve, reject) {
    pool.query(
      'SELECT "accountNumber", "silveuros" FROM accounts WHERE "accountNumber" = $1',
      [accountNumber],
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (results && results.rows) {
          const user = results.rows[0];
          user.silveuros = decryptValue(user.silveuros);
          resolve(user);
        } else {
          reject(new Error("No results found"));
        }
      }
    );
  });
};

const getTransactionHistory = async (accountNumber) => {
  return await new Promise(function (resolve, reject) {
    pool.query(
      'SELECT * FROM transactions WHERE "accountNumberSentFrom" = $1 OR "accountNumberSentTo" = $1 ORDER BY created_dtm DESC LIMIT 8',
      [accountNumber],
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (results && results.rows) {
          const transations = results.rows;
          resolve(transations);
        } else {
          reject(new Error("No results found"));
        }
      }
    );
  });
};

const writeTransaction = async (transaction) => {
  const { accountNumberSentFrom, accountNumberSentTo, amountSent } =
    transaction;
  return await new Promise(function (resolve, reject) {
    pool.query(
      'INSERT INTO transactions ("accountNumberSentFrom", "accountNumberSentTo", "amountSent") VALUES ($1, $2, $3) RETURNING *',
      [accountNumberSentFrom, accountNumberSentTo, amountSent],
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (results && results.rows) {
          resolve(true);
        } else {
          reject(new Error("No results found"));
        }
      }
    );
  });
};

const validateUser = async (accountNumber, password) => {
  return await new Promise(function (resolve, reject) {
    pool.query(
      'SELECT * FROM accounts WHERE "accountNumber" = $1',
      [accountNumber],
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (results && results.rows.length > 0) {
          const user = results.rows[0];

          if (bcrypt.compare(password, user.password)) {
            user.silveuros = decryptValue(user.silveuros);
            delete user.password;
            resolve(user);
          } else {
            reject(new Error("Invalid password"));
          }
        } else {
          reject(new Error("No results found"));
        }
      }
    );
  });
};

const generateRandomKey = () => {
  return crypto.randomBytes(32).toString("hex"); // 32 bytes = 256 bits
};

const encryptValue = (valueToEncrypt) => {
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(secretKey, "hex"),
    iv
  );
  let encrypted = cipher.update(valueToEncrypt);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

const decryptValue = (valueToDecrypt) => {
  let textParts = valueToDecrypt.split(":");
  let iv = Buffer.from(textParts.shift(), "hex");
  let encryptedText = Buffer.from(textParts.join(":"), "hex");
  let decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretKey, "hex"),
    iv
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

module.exports = {
  getAllAccounts,
  registerUser,
  authenticateUser,
  sendSilveuroToUser,
};
