import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',

    info: {
      title: 'Estoke API',
      version: '1.0.0',
      description: 'Gestão de estoque',
      contact: {
        name: 'KelvynK Dev',
      },
    },

    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor Local',
      },
      {
        url: 'https://api.pastelariadoj.com.br',
        description: 'Produção',
      },
    ],

    tags: [
      { name: 'Auth', description: 'Autenticação' },
      { name: 'Usuários', description: 'Gerenciamento de usuários' },
      { name: 'Categorias', description: 'Gerenciamento de categorias' },
      { name: 'Produtos', description: 'Gerenciamento de produtos' },
      { name: 'Insumos', description: 'Gerenciamento de insumos' },
      { name: 'Estoque', description: 'Controle de estoque e movimentações' },
      { name: 'Vendas', description: 'Gerenciamento de vendas' },
      { name: 'Config', description: 'Configurações do sistema' },
      { name: 'Lojas', description: 'Gerenciamento de lojas' },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },

      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'admin' },
            email: { type: 'string', example: 'admin@admin.com' },
            role: {
              type: 'string',
              enum: ['admin', 'manager', 'employee'],
              example: 'admin',
            },
            store_id: { type: 'integer', example: 1 },
            is_active: { type: 'boolean', example: true },
          },
        },

        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'admin@admin.com' },
            password: { type: 'string', example: 'admin' },
          },
        },

        AuthResponse: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
            user: {
              $ref: '#/components/schemas/User',
            },
          },
        },

        RefreshRequest: {
          type: 'object',
          required: ['refreshToken'],
          properties: {
            refreshToken: {
              type: 'string',
              example: 'seu_refresh_token',
            },
          },
        },

        Message: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Operação realizada com sucesso',
            },
          },
        },

        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Erro interno do servidor',
            },
            message: {
              type: 'string',
              example: 'Mensagem do erro',
            },
          },
        },
      },

      responses: {
        UnauthorizedError: {
          description: 'Token inválido ou não enviado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },

        ForbiddenError: {
          description: 'Acesso negado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },

        InternalError: {
          description: 'Erro interno do servidor',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
      },
    },
  },

  apis: ['./src/routes/*.js'],
};

export const swaggerSpec = swaggerJSDoc(options);
