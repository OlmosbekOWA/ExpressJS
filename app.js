import 'dotenv/config';   

//kutubxonalar
import express from "express";
import mongoose from 'mongoose';
import fileUpload from "express-fileupload";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

//fayllar
import postRoute from "./routers/post.route.js";
import usersRouter from "./routers/users.route.js";
import authRouter from "./routers/auth.route.js"
import requestTime from './middlewars/request-time.js';
import errorHandler from './middlewars/errors.middlewers.js';


const app = express();

const PORT = process.env.PORT || 5000;

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ExpressDemo API',
      version: '1.0.0',
      description: 'API documentation for ExpressDemo backend',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
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
            id: {
              type: 'string',
              example: '60d5ecb74b24c72b8c8b4567'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com'
            },
            isActivated: {
              type: 'boolean',
              example: false
            }
          }
        },
        UserProfile: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '60d5ecb74b24c72b8c8b4567'
            },
            name: {
              type: 'string',
              example: 'John'
            },
            surname: {
              type: 'string',
              example: 'Doe'
            },
            age: {
              type: 'number',
              example: 25
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john.doe@example.com'
            },
            interests: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: ['reading', 'coding']
            },
            school: {
              type: 'string',
              example: 'High School'
            },
            class: {
              type: 'string',
              example: '10-A'
            },
            passport: {
              type: 'object',
              properties: {
                series: {
                  type: 'string',
                  example: 'AB'
                },
                number: {
                  type: 'string',
                  example: '1234567'
                }
              }
            }
          }
        },
        Post: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '60d5ecb74b24c72b8c8b4567'
            },
            title: {
              type: 'string',
              example: 'Post title'
            },
            body: {
              type: 'string',
              example: 'Post content'
            },
            picture: {
              type: 'string',
              example: 'filename.jpg'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./controllers/*.js', './routers/*.js'], // Paths to files containing OpenAPI definitions
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

//meddlewars
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}))
app.use(express.static("static"))
app.use(requestTime)
app.use(cookieParser({}))

//routs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/api/post", postRoute);
app.use("/api/user", usersRouter);
app.use("/api/auth", authRouter)

//error handler
app.use(errorHandler)

const bootstrap = async () => {
  try {

    if (!process.env.DB_URL) {
      throw new Error("DB_URL .env faylida topilmadi yoki o'qilmadi!");
    }

    await mongoose.connect(process.env.DB_URL);

    app.listen(PORT, () => {
      console.log(`Server http://localhost:${PORT} da ishlamoqda`);
    });
  } catch (err) {
    console.error("Ulanish xatosi:", err.message);
    console.error(err);   
  }
};

bootstrap();