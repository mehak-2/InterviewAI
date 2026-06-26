const swaggerDocument = {
    openapi: "3.0.3",
    info: {
        title: "AI Interview Coach API",
        version: "1.0.0",
        description: "Interactive API docs for the AI Interview Coach backend.",
    },
    servers: [
        {
            url: "http://localhost:5000",
            description: "Local development server",
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
        schemas: {
            RegisterRequest: {
                type: "object",
                required: ["firstName", "lastName", "email", "password"],
                properties: {
                    firstName: { type: "string", example: "Anshul" },
                    lastName: { type: "string", example: "Sharma" },
                    email: { type: "string", format: "email", example: "anshul@example.com" },
                    password: { type: "string", example: "TestPass123" },
                },
            },
            LoginRequest: {
                type: "object",
                required: ["email", "password"],
                properties: {
                    email: { type: "string", format: "email", example: "anshul@example.com" },
                    password: { type: "string", example: "TestPass123" },
                },
            },
            CreateInterviewRequest: {
                type: "object",
                required: ["role", "experience", "difficulty"],
                properties: {
                    role: { type: "string", example: "Frontend Developer" },
                    experience: { type: "string", example: "2 Years" },
                    difficulty: { type: "string", example: "Intermediate" },
                    interviewType: {
                        type: "string",
                        enum: ["technical", "behavioural", "mixed"],
                        example: "technical",
                    },
                    totalQuestions: { type: "integer", example: 5 },
                    resumeId: { type: "string", example: "665f3ccaa0f22c1234567890" },
                },
            },
            SubmitResponseRequest: {
                type: "object",
                required: ["questionId", "answer"],
                properties: {
                    questionId: { type: "string", example: "665f3ccaa0f22c1234567890" },
                    answer: {
                        type: "string",
                        example:
                            "Virtual DOM is a lightweight representation of the real DOM that helps React batch updates efficiently.",
                    },
                },
            },
            SuccessMessage: {
                type: "object",
                properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Logged out successfully" },
                },
            },
        },
    },
    tags: [
        { name: "Auth" },
        { name: "Interviews" },
        { name: "Responses" },
        { name: "Resumes" },
        { name: "Analytics" },
    ],
    paths: {
        "/api/auth/register": {
            post: {
                tags: ["Auth"],
                summary: "Register a new user",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/RegisterRequest" },
                        },
                    },
                },
                responses: {
                    201: { description: "User registered successfully" },
                },
            },
        },
        "/api/auth/login": {
            post: {
                tags: ["Auth"],
                summary: "Login a user",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/LoginRequest" },
                        },
                    },
                },
                responses: {
                    200: { description: "User logged in successfully" },
                },
            },
        },
        "/api/auth/me": {
            get: {
                tags: ["Auth"],
                summary: "Get the current user",
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: "Current user returned successfully" },
                },
            },
        },
        "/api/auth/logout": {
            post: {
                tags: ["Auth"],
                summary: "Logout the current user",
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: "User logged out successfully",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/SuccessMessage" },
                            },
                        },
                    },
                },
            },
        },
        "/api/interviews": {
            post: {
                tags: ["Interviews"],
                summary: "Create an interview and generate questions",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/CreateInterviewRequest" },
                        },
                    },
                },
                responses: {
                    201: { description: "Interview created successfully" },
                },
            },
            get: {
                tags: ["Interviews"],
                summary: "Get all interviews for the current user",
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: "Interview list returned successfully" },
                },
            },
        },
        "/api/interviews/{id}": {
            get: {
                tags: ["Interviews"],
                summary: "Get a single interview by id",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    200: { description: "Interview returned successfully" },
                },
            },
            delete: {
                tags: ["Interviews"],
                summary: "Delete an interview by id",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    200: { description: "Interview deleted successfully" },
                },
            },
        },
        "/api/interviews/{id}/complete": {
            post: {
                tags: ["Interviews"],
                summary: "Complete an interview and generate the final evaluation",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    200: { description: "Interview completed successfully" },
                },
            },
        },
        "/api/responses": {
            post: {
                tags: ["Responses"],
                summary: "Submit and evaluate an answer",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/SubmitResponseRequest" },
                        },
                    },
                },
                responses: {
                    201: { description: "Response submitted successfully" },
                },
            },
        },
        "/api/resumes/upload": {
            post: {
                tags: ["Resumes"],
                summary: "Upload a resume PDF",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "multipart/form-data": {
                            schema: {
                                type: "object",
                                required: ["resume"],
                                properties: {
                                    resume: {
                                        type: "string",
                                        format: "binary",
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: { description: "Resume uploaded successfully" },
                },
            },
        },
        "/api/resumes": {
            get: {
                tags: ["Resumes"],
                summary: "Get all resumes for the current user",
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: "Resume list returned successfully" },
                },
            },
        },
        "/api/resumes/active": {
            get: {
                tags: ["Resumes"],
                summary: "Get the active resume for the current user",
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: "Active resume returned successfully" },
                },
            },
        },
        "/api/resumes/{id}": {
            delete: {
                tags: ["Resumes"],
                summary: "Delete a resume by id",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    200: { description: "Resume deleted successfully" },
                },
            },
        },
        "/api/analytics/dashboard": {
            get: {
                tags: ["Analytics"],
                summary: "Get dashboard stats",
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: "Dashboard stats returned successfully" },
                },
            },
        },
        "/api/analytics/trends": {
            get: {
                tags: ["Analytics"],
                summary: "Get performance trends",
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: "Performance trends returned successfully" },
                },
            },
        },
        "/api/analytics/history": {
            get: {
                tags: ["Analytics"],
                summary: "Get interview history",
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: "Interview history returned successfully" },
                },
            },
        },
        "/api/analytics/scores": {
            get: {
                tags: ["Analytics"],
                summary: "Get aggregate score breakdowns",
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: "Score breakdown returned successfully" },
                },
            },
        },
    },
};

export default swaggerDocument;
