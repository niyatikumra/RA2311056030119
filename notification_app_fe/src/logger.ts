const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJuazE1NzNAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwNjcxMSwiaWF0IjoxNzc3NzA1ODExLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZGEwNzg1MzMtYzM5NC00MGM5LWJhOTUtMmMzZTEzODFlZDY3IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoibml5YXRpIiwic3ViIjoiMDBkYzVhNDctODljMy00ZGI2LTk2MDctYzFiNjY0Yjk2MzE0In0sImVtYWlsIjoibmsxNTczQHNybWlzdC5lZHUuaW4iLCJuYW1lIjoibml5YXRpIiwicm9sbE5vIjoicmEyMzExMDU2MDMwMTE5IiwiYWNjZXNzQ29kZSI6IlFrYnB4SCIsImNsaWVudElEIjoiMDBkYzVhNDctODljMy00ZGI2LTk2MDctYzFiNjY0Yjk2MzE0IiwiY2xpZW50U2VjcmV0Ijoid2ZCUVJGakNGVnJBenh0RCJ9.MbqxHE8UtDGbVcvY3zxGvnYQyMi0yQ4O37QqFYjEfEQ";
export const Log = async (stack: string, level: string, pkg: string, message: string) => {
  try {
    await fetch("/api/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${TOKEN}`
      },
      body: JSON.stringify({ stack, level, package: pkg, message })
    });
  } catch (e) {}
};