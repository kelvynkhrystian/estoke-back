import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Estoke API",
      version: "1.0.0",
      description: "API de gestão de estoque (Estoke)",
      contact: {
        name: "Kelvyn Dev",
      },
    },

    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor Local",
      },
      {
        url: "https://app.pastelariadoj.com.br",
        description: "Produção",
      },
    ],

    tags: [
      { name: "Auth", description: "Autenticação" },
      { name: "Categories", description: "Categorias" },
      { name: "Products", description: "Produtos" },
      { name: "Stock", description: "Estoque" },
      { name: "Sales", description: "Vendas" },
      { name: "Config", description: "Configurações" },
      { name: "Stores", description: "Lojas" },
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
        // ================= USER =================
        User: {
          type: "object",
          properties: {
            id: { type: "number", example: 1 },
            name: { type: "string", example: "Admin" },
            role: { type: "string", example: "admin" },
            store_id: { type: "number", example: 1 },
          },
        },

        // ================= LOGIN REQUEST =================
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "admin@gmail.com" },
            password: { type: "string", example: "admin" },
          },
        },

        // ================= AUTH RESPONSE =================
        AuthResponse: {
          type: "object",
          properties: {
            accessToken: { type: "string" },
            refreshToken: { type: "string" },
            user: {
              $ref: "#/components/schemas/User",
            },
          },
        },

        // ================= REFRESH =================
        RefreshRequest: {
          type: "object",
          required: ["refreshToken"],
          properties: {
            refreshToken: {
              type: "string",
              example: "seu_refresh_token",
            },
          },
        },

        // ================= GENERIC MESSAGE =================
        Message: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Operação realizada com sucesso",
            },
          },
        },

        // ================= ERROR =================
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              example: "Erro interno do servidor",
            },
          },
        },
      },

      responses: {
        UnauthorizedError: {
          description: "Token inválido ou não enviado",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },

        ForbiddenError: {
          description: "Acesso negado",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },

        InternalError: {
          description: "Erro interno do servidor",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
      },
    },

    // 🔒 aplica auth global (pode remover se quiser granular)
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  // 🔥 lê todos os arquivos de rota
  apis: ["./src/routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);