import "./src/config/env.js";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";

connectDB();

if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(
            `Server running on port ${PORT}`
        );
    });
}

export default app;
