import swaggerUi from 'swagger-ui-express';

export const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Lumo Marketplace API',
    version: '3.0.0',
    description: `### Lumo Marketplace Backend REST API
Bu API Lumo Marketplace platformasi uchun to'liq REST API va Swagger hujjatlaridir.

#### Autentifikatsiya (Authentication):
- Ko'pgina yopiq endpointlar **Bearer Token** talab qiladi.
- Yuqoridagi **Authorize** tugmasini bosing va \`Bearer <sizning_jwt_tokeningiz>\` yoki to'g'ridan-to'g'ri JWT tokeningizni kiriting.
- Mehmon (Guest) savat va buyurtma uchun \`x-guest-session-id\` headeridan foydalaniladi.`,
    contact: {
      name: 'Lumo Support Team',
      email: 'support@lumomarket.uz'
    }
  },
  servers: [
    {
      url: '/api',
      description: 'Asosiy API serveri (/api)'
    },
    {
      url: 'https://uzum.maktab16.uz/api',
      description: 'Production server (uzum.maktab16.uz)'
    },
    {
      url: 'http://localhost:5000/api',
      description: 'Localhost server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: "JWT access tokeningizni kiriting (masalan: 'eyJhbGciOi...')"
      },
      guestSessionAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'x-guest-session-id',
        description: 'Mehmon foydalanuvchilar uchun session UUID'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '662fb1a38f36c53e8d98ef11' },
          fullname: { type: 'string', example: 'Aziz Rahimov' },
          email: { type: 'string', format: 'email', example: 'aziz@example.com' },
          role: { type: 'string', enum: ['user', 'seller', 'admin'], example: 'user' },
          avatar: { type: 'string', example: 'https://images.unsplash.com/...' },
          phone: { type: 'string', example: '+998901234567' },
          address: { type: 'string', example: 'Toshkent sh., Yunusobod tumani' },
          isSellerApproved: { type: 'boolean', example: false },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      Product: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '662fb1a38f36c53e8d98ef22' },
          name: { type: 'string', example: 'Simsiz Naushnik Pro X' },
          description: { type: 'string', example: 'Shovqinni bekor qiluvchi quloqchinlar' },
          price: { type: 'number', example: 450000 },
          oldPrice: { type: 'number', example: 550000 },
          category: { type: 'string', example: '662fb1a38f36c53e8d98ef33' },
          stock: { type: 'integer', example: 25 },
          images: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                url: { type: 'string', example: '/uploads/product-123.jpg' },
                alt: { type: 'string', example: 'Old ko‘rinish' }
              }
            }
          },
          seller: { type: 'string', example: '662fb1a38f36c53e8d98ef11' },
          rating: { type: 'number', example: 4.8 },
          reviewsCount: { type: 'integer', example: 12 },
          status: { type: 'string', enum: ['active', 'draft', 'archived'], example: 'active' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      Category: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '662fb1a38f36c53e8d98ef33' },
          name: { type: 'string', example: 'Elektronika' },
          slug: { type: 'string', example: 'elektronika' },
          icon: { type: 'string', example: 'Smartphone' },
          image: { type: 'string', example: '/uploads/electronics.png' },
          parent: { type: 'string', nullable: true, example: null },
          description: { type: 'string', example: 'Barcha turdagi elektron jihozlar' },
          isActive: { type: 'boolean', example: true }
        }
      },
      Store: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '662fb1a38f36c53e8d98ef44' },
          seller: { type: 'string', example: '662fb1a38f36c53e8d98ef11' },
          name: { type: 'string', example: 'TechStore Tashkent' },
          slug: { type: 'string', example: 'techstore-tashkent' },
          description: { type: 'string', example: 'Eng sifatli texnika do‘koni' },
          logo: { type: 'string', example: '/uploads/techstore-logo.jpg' },
          banner: { type: 'string', example: '/uploads/techstore-banner.jpg' },
          phone: { type: 'string', example: '+998901234567' },
          address: { type: 'string', example: 'Toshkent, Malika savdo markazi' },
          isApproved: { type: 'boolean', example: true },
          isActive: { type: 'boolean', example: true }
        }
      },
      CartItem: {
        type: 'object',
        properties: {
          product: { $ref: '#/components/schemas/Product' },
          quantity: { type: 'integer', example: 2 },
          price: { type: 'number', example: 450000 },
          name: { type: 'string', example: 'Simsiz Naushnik Pro X' },
          image: { type: 'string', example: '/uploads/product-123.jpg' }
        }
      },
      Cart: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '662fb1a38f36c53e8d98ef55' },
          user: { type: 'string', nullable: true, example: '662fb1a38f36c53e8d98ef11' },
          sessionId: { type: 'string', nullable: true, example: 'guest-session-uuid-1234' },
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/CartItem' }
          },
          subtotal: { type: 'number', example: 900000 }
        }
      },
      Wishlist: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '662fb1a38f36c53e8d98ef66' },
          user: { type: 'string', example: '662fb1a38f36c53e8d98ef11' },
          products: {
            type: 'array',
            items: { $ref: '#/components/schemas/Product' }
          }
        }
      },
      Order: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '662fb1a38f36c53e8d98ef77' },
          user: { type: 'string', nullable: true, example: '662fb1a38f36c53e8d98ef11' },
          guestSessionId: { type: 'string', nullable: true, example: 'guest-session-uuid-1234' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                product: { type: 'string', example: '662fb1a38f36c53e8d98ef22' },
                title: { type: 'string', example: 'Simsiz Naushnik Pro X' },
                price: { type: 'number', example: 450000 },
                quantity: { type: 'integer', example: 1 },
                image: { type: 'string', example: '/uploads/product-123.jpg' },
                seller: { type: 'string', example: '662fb1a38f36c53e8d98ef11' }
              }
            }
          },
          total: { type: 'number', example: 450000 },
          shippingAddress: {
            type: 'object',
            properties: {
              fullName: { type: 'string', example: 'Aziz Rahimov' },
              phone: { type: 'string', example: '+998901234567' },
              address: { type: 'string', example: 'Yunusobod 4-mavze 12-uy' },
              city: { type: 'string', example: 'Toshkent' },
              postalCode: { type: 'string', example: '100000' }
            }
          },
          paymentMethod: {
            type: 'string',
            enum: ['cash_on_delivery', 'card', 'click', 'payme'],
            example: 'cash_on_delivery'
          },
          paymentStatus: {
            type: 'string',
            enum: ['pending', 'paid', 'failed'],
            example: 'pending'
          },
          orderStatus: {
            type: 'string',
            enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
            example: 'pending'
          },
          invoiceNumber: { type: 'string', example: 'INV-1714392812000-842' },
          trackingNumber: { type: 'string', example: 'TRACK-9823471' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      Review: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '662fb1a38f36c53e8d98ef88' },
          product: { type: 'string', example: '662fb1a38f36c53e8d98ef22' },
          user: {
            type: 'object',
            properties: {
              _id: { type: 'string', example: '662fb1a38f36c53e8d98ef11' },
              fullname: { type: 'string', example: 'Aziz Rahimov' },
              avatar: { type: 'string', example: 'https://images.unsplash.com/...' }
            }
          },
          rating: { type: 'number', minimum: 1, maximum: 5, example: 5 },
          comment: { type: 'string', example: 'Juda zo‘r mahsulot, tavsiya qilaman!' },
          isApproved: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      Banner: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '662fb1a38f36c53e8d98ef99' },
          title: { type: 'string', example: 'Bahorgi chegirmalar 50% gacha' },
          image: { type: 'string', example: '/uploads/banner-spring.jpg' },
          link: { type: 'string', example: '/category/elektronika' },
          position: { type: 'string', example: 'home_main' },
          isActive: { type: 'boolean', example: true },
          order: { type: 'integer', example: 1 }
        }
      },
      Settings: {
        type: 'object',
        properties: {
          siteName: { type: 'string', example: 'Lumo Marketplace' },
          logo: { type: 'string', example: '/uploads/logo.png' },
          currency: { type: 'string', example: "so'm" },
          contactEmail: { type: 'string', example: 'contact@lumomarket.uz' },
          contactPhone: { type: 'string', example: '+998712000000' },
          socialLinks: {
            type: 'object',
            properties: {
              telegram: { type: 'string', example: 'https://t.me/lumomarket' },
              instagram: { type: 'string', example: 'https://instagram.com/lumomarket' },
              facebook: { type: 'string', example: 'https://facebook.com/lumomarket' }
            }
          },
          feePercentage: { type: 'number', example: 5 },
          maintenanceMode: { type: 'boolean', example: false }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Xatolik yuz berdi' },
          stack: { type: 'string', example: 'Error stack trace...' }
        }
      }
    }
  },
  paths: {
    // ----------------------------------------------------
    // AUTHENTICATION
    // ----------------------------------------------------
    '/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Yangi foydalanuvchini ro‘yxatdan o‘tkazish',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['fullname', 'email', 'password'],
                properties: {
                  fullname: { type: 'string', example: 'Aziz Rahimov' },
                  email: { type: 'string', format: 'email', example: 'aziz@example.com' },
                  password: { type: 'string', minLength: 6, example: 'secret123' }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Muvaffaqiyatli ro‘yxatdan o‘tdi',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: { $ref: '#/components/schemas/User' },
                    accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1Ni...' }
                  }
                }
              }
            }
          },
          400: { description: 'Validatsiya xatosi', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          409: { description: 'Foydalanuvchi allaqachon mavjud', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Tizimga kirish (Login)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'aziz@example.com' },
                  password: { type: 'string', example: 'secret123' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Muvaffaqiyatli login',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: { $ref: '#/components/schemas/User' },
                    accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1Ni...' }
                  }
                }
              }
            }
          },
          401: { description: 'Noto‘g‘ri parol yoki email', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/auth/google': {
      post: {
        tags: ['Authentication'],
        summary: 'Google OAuth orqali kirish/ro‘yxatdan o‘tish',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['idToken'],
                properties: {
                  idToken: { type: 'string', example: 'firebase-or-google-id-token' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Google orqali muvaffaqiyatli autentifikatsiya',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: { $ref: '#/components/schemas/User' },
                    accessToken: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/auth/refresh': {
      post: {
        tags: ['Authentication'],
        summary: 'Access tokenni yangilash (Refresh Token cookie orqali)',
        responses: {
          200: {
            description: 'Yangi access token berildi',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1Ni...' }
                  }
                }
              }
            }
          },
          401: { description: 'Refresh token noto‘g‘ri yoki muddati tugagan' }
        }
      }
    },
    '/auth/logout': {
      post: {
        tags: ['Authentication'],
        summary: 'Tizimdan chiqish (Logout)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Chiqildi',
            content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string', example: 'Logged out' } } } } }
          }
        }
      }
    },
    '/auth/session': {
      get: {
        tags: ['Authentication'],
        summary: 'Joriy sessiya holatini tekshirish (Header Token bilan)',
        responses: {
          200: {
            description: 'Sessiya holati',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    authenticated: { type: 'boolean', example: true },
                    user: { $ref: '#/components/schemas/User' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/auth/me': {
      get: {
        tags: ['Authentication'],
        summary: 'Joriy foydalanuvchi ma’lumotlari',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Foydalanuvchi profili',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: { $ref: '#/components/schemas/User' }
                  }
                }
              }
            }
          }
        }
      }
    },

    // ----------------------------------------------------
    // PRODUCTS
    // ----------------------------------------------------
    '/products': {
      get: {
        tags: ['Products'],
        summary: 'Mahsulotlar ro‘yxati (Filtr, qidiruv va sahifalash bilan)',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 }, description: 'Sahifa raqami' },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 12 }, description: 'Bitta sahifadagi mahsulotlar soni' },
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Qidiruv so‘zi' },
          { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Kategoriya ID yoki slug' },
          { name: 'minPrice', in: 'query', schema: { type: 'number' }, description: 'Minimal narx' },
          { name: 'maxPrice', in: 'query', schema: { type: 'number' }, description: 'Maksimal narx' },
          { name: 'sort', in: 'query', schema: { type: 'string', enum: ['price-asc', 'price-desc', 'newest', 'rating'] }, description: 'Saralash' }
        ],
        responses: {
          200: {
            description: 'Mahsulotlar ro‘yxati',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    products: { type: 'array', items: { $ref: '#/components/schemas/Product' } },
                    total: { type: 'integer', example: 120 },
                    page: { type: 'integer', example: 1 },
                    pages: { type: 'integer', example: 10 }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Products'],
        summary: 'Yangi mahsulot yaratish (Faqat Seller va Admin)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'price', 'category'],
                properties: {
                  name: { type: 'string', example: 'Smart Watch Series 8' },
                  description: { type: 'string', example: 'Amoled ekranli aqlli soat' },
                  price: { type: 'number', example: 350000 },
                  oldPrice: { type: 'number', example: 400000 },
                  category: { type: 'string', example: '662fb1a38f36c53e8d98ef33' },
                  stock: { type: 'integer', example: 15 },
                  images: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        url: { type: 'string', example: '/uploads/smartwatch.jpg' },
                        alt: { type: 'string', example: 'Watch view' }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Mahsulot yaratildi',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } }
          }
        }
      }
    },
    '/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Bitta mahsulot tafsilotlarini olish',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Mahsulot ID' }
        ],
        responses: {
          200: { description: 'Mahsulot ma’lumotlari', content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } } },
          404: { description: 'Mahsulot topilmadi' }
        }
      },
      put: {
        tags: ['Products'],
        summary: 'Mahsulotni tahrirlash (Seller / Admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Mahsulot ID' }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  price: { type: 'number' },
                  oldPrice: { type: 'number' },
                  stock: { type: 'integer' },
                  category: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Mahsulot yangilandi', content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } } },
          404: { description: 'Mahsulot topilmadi' }
        }
      },
      delete: {
        tags: ['Products'],
        summary: 'Mahsulotni o‘chirish (Seller / Admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Mahsulot ID' }
        ],
        responses: {
          200: { description: 'Mahsulot o‘chirildi', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string', example: 'Deleted' } } } } } },
          404: { description: 'Mahsulot topilmadi' }
        }
      }
    },
    '/products/{id}/images': {
      post: {
        tags: ['Products'],
        summary: 'Mahsulotga rasmlar yuklash (Multipart upload, 5 tagacha)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Mahsulot ID' }
        ],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  images: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                    description: 'Yuklanadigan rasmlar (max 5)'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Rasmlar yuklandi',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    images: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          url: { type: 'string' },
                          alt: { type: 'string' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },

    // ----------------------------------------------------
    // CATEGORIES
    // ----------------------------------------------------
    '/categories': {
      get: {
        tags: ['Categories'],
        summary: 'Barcha kategoriyalar ro‘yxati',
        responses: {
          200: {
            description: 'Kategoriyalar ro‘yxati',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Category' } } } }
          }
        }
      },
      post: {
        tags: ['Categories'],
        summary: 'Yangi kategoriya yaratish (Faqat Admin)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'Smartfonlar' },
                  slug: { type: 'string', example: 'smartfonlar' },
                  icon: { type: 'string', example: 'Smartphone' },
                  image: { type: 'string', example: '/uploads/smartphones.jpg' },
                  parent: { type: 'string', nullable: true, example: null },
                  description: { type: 'string', example: 'Eng so‘nggi smartfonlar' }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Kategoriya yaratildi',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Category' } } }
          }
        }
      }
    },
    '/categories/{id}': {
      put: {
        tags: ['Categories'],
        summary: 'Kategoriyani yangilash (Admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  icon: { type: 'string' },
                  image: { type: 'string' },
                  description: { type: 'string' },
                  isActive: { type: 'boolean' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Kategoriya yangilandi', content: { 'application/json': { schema: { $ref: '#/components/schemas/Category' } } } },
          404: { description: 'Kategoriya topilmadi' }
        }
      },
      delete: {
        tags: ['Categories'],
        summary: 'Kategoriyani o‘chirish (Admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'O‘chirildi', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string', example: 'Deleted' } } } } } },
          404: { description: 'Kategoriya topilmadi' }
        }
      }
    },

    // ----------------------------------------------------
    // CART
    // ----------------------------------------------------
    '/cart': {
      get: {
        tags: ['Cart'],
        summary: 'Savat tarkibini olish (Foydalanuvchi yoki x-guest-session-id orqali)',
        security: [{ bearerAuth: [] }, { guestSessionAuth: [] }],
        responses: {
          200: {
            description: 'Savat ma’lumotlari',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Cart' } } }
          }
        }
      },
      delete: {
        tags: ['Cart'],
        summary: 'Savatni tozalash',
        security: [{ bearerAuth: [] }, { guestSessionAuth: [] }],
        responses: {
          200: {
            description: 'Savat tozalandi',
            content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string', example: 'Cart cleared' } } } } }
          }
        }
      }
    },
    '/cart/items': {
      post: {
        tags: ['Cart'],
        summary: 'Mahsulotni savatga qo‘shish',
        security: [{ bearerAuth: [] }, { guestSessionAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['productId'],
                properties: {
                  productId: { type: 'string', example: '662fb1a38f36c53e8d98ef22' },
                  quantity: { type: 'integer', default: 1, example: 1 }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Savatga qo‘shildi', content: { 'application/json': { schema: { $ref: '#/components/schemas/Cart' } } } },
          404: { description: 'Mahsulot topilmadi' }
        }
      }
    },
    '/cart/items/{productId}': {
      patch: {
        tags: ['Cart'],
        summary: 'Savatdagi mahsulot miqdorini o‘zgartirish',
        security: [{ bearerAuth: [] }, { guestSessionAuth: [] }],
        parameters: [
          { name: 'productId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['quantity'],
                properties: {
                  quantity: { type: 'integer', example: 3 }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Savat yangilandi', content: { 'application/json': { schema: { $ref: '#/components/schemas/Cart' } } } }
        }
      },
      delete: {
        tags: ['Cart'],
        summary: 'Savatdan bitta mahsulotni o‘chirish',
        security: [{ bearerAuth: [] }, { guestSessionAuth: [] }],
        parameters: [
          { name: 'productId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'Mahsulot savatdan o‘chirildi', content: { 'application/json': { schema: { $ref: '#/components/schemas/Cart' } } } }
        }
      }
    },
    '/cart/sync': {
      post: {
        tags: ['Cart'],
        summary: 'Mehmon savatini tizimga kirgan foydalanuvchi hisobiga birlashtirish (Sync)',
        security: [{ bearerAuth: [] }, { guestSessionAuth: [] }],
        responses: {
          200: { description: 'Savat sinxronlashtirildi', content: { 'application/json': { schema: { $ref: '#/components/schemas/Cart' } } } },
          401: { description: 'Avtorizatsiyadan o‘tilmagan' }
        }
      }
    },

    // ----------------------------------------------------
    // WISHLIST
    // ----------------------------------------------------
    '/wishlist': {
      get: {
        tags: ['Wishlist'],
        summary: 'Sevimlilar ro‘yxati (Foydalanuvchi)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Sevimlilar ro‘yxati',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Wishlist' } } }
          }
        }
      }
    },
    '/wishlist/{productId}': {
      post: {
        tags: ['Wishlist'],
        summary: 'Mahsulotni sevimlilarga qo‘shish',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'productId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'Sevimlilarga qo‘shildi', content: { 'application/json': { schema: { $ref: '#/components/schemas/Wishlist' } } } }
        }
      },
      delete: {
        tags: ['Wishlist'],
        summary: 'Mahsulotni sevimlilardan o‘chirish',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'productId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'Sevimlilardan o‘chirildi', content: { 'application/json': { schema: { $ref: '#/components/schemas/Wishlist' } } } }
        }
      }
    },

    // ----------------------------------------------------
    // ORDERS
    // ----------------------------------------------------
    '/orders': {
      get: {
        tags: ['Orders'],
        summary: 'Foydalanuvchining o‘z buyurtmalari ro‘yxati',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Buyurtmalar ro‘yxati',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Order' } } } }
          }
        }
      },
      post: {
        tags: ['Orders'],
        summary: 'Yangi buyurtma yaratish (Foydalanuvchi yoki Mehmon)',
        security: [{ bearerAuth: [] }, { guestSessionAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['shippingAddress', 'paymentMethod'],
                properties: {
                  shippingAddress: {
                    type: 'object',
                    required: ['fullName', 'phone', 'address'],
                    properties: {
                      fullName: { type: 'string', example: 'Aziz Rahimov' },
                      phone: { type: 'string', example: '+998901234567' },
                      address: { type: 'string', example: 'Amir Temur ko‘chasi, 15-uy' },
                      city: { type: 'string', example: 'Toshkent' },
                      postalCode: { type: 'string', example: '100000' }
                    }
                  },
                  paymentMethod: {
                    type: 'string',
                    enum: ['cash_on_delivery', 'card', 'click', 'payme'],
                    example: 'cash_on_delivery'
                  },
                  items: {
                    type: 'array',
                    description: 'Agar yuborilmasa, savatdagi mahsulotlar olinadi',
                    items: {
                      type: 'object',
                      properties: {
                        product: { type: 'string', example: '662fb1a38f36c53e8d98ef22' },
                        quantity: { type: 'integer', example: 1 }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Buyurtma rasmiylashtirildi',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Order' } } }
          }
        }
      }
    },
    '/orders/{id}': {
      get: {
        tags: ['Orders'],
        summary: 'Bitta buyurtma tafsilotlari',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'Buyurtma ma’lumotlari', content: { 'application/json': { schema: { $ref: '#/components/schemas/Order' } } } },
          404: { description: 'Buyurtma topilmadi' }
        }
      }
    },
    '/orders/{id}/status': {
      patch: {
        tags: ['Orders'],
        summary: 'Buyurtma statusini yangilash (Seller / Admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: {
                    type: 'string',
                    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
                    example: 'shipped'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Status yangilandi', content: { 'application/json': { schema: { $ref: '#/components/schemas/Order' } } } }
        }
      }
    },

    // ----------------------------------------------------
    // REVIEWS
    // ----------------------------------------------------
    '/reviews/products/{productId}': {
      get: {
        tags: ['Reviews'],
        summary: 'Mahsulotga bildirilgan tasdiqlangan sharhlar',
        parameters: [
          { name: 'productId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: {
            description: 'Sharhlar ro‘yxati',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Review' } } } }
          }
        }
      },
      post: {
        tags: ['Reviews'],
        summary: 'Mahsulotga yangi sharh va baho qoldirish',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'productId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['rating', 'comment'],
                properties: {
                  rating: { type: 'number', minimum: 1, maximum: 5, example: 5 },
                  comment: { type: 'string', example: 'Juda tez yetkazib berishdi, rahmat!' }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Sharh qo‘shildi',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Review' } } }
          }
        }
      }
    },

    // ----------------------------------------------------
    // SELLER
    // ----------------------------------------------------
    '/seller/overview': {
      get: {
        tags: ['Seller'],
        summary: 'Sotuvchi asosiy statistikasi (Mahsulotlar soni, buyurtmalar, tushum)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Statistika',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    products: { type: 'integer', example: 15 },
                    orders: { type: 'integer', example: 42 },
                    revenue: { type: 'number', example: 18900000 }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/seller/products': {
      get: {
        tags: ['Seller'],
        summary: 'Sotuvchining barcha mahsulotlari',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Mahsulotlar',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Product' } } } }
          }
        }
      },
      post: {
        tags: ['Seller'],
        summary: 'Sotuvchi tomonidan yangi mahsulot qo‘shish',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'price', 'category'],
                properties: {
                  name: { type: 'string', example: 'Ultrabook Pro 15' },
                  description: { type: 'string', example: 'Kuchli noutbuk' },
                  price: { type: 'number', example: 8500000 },
                  category: { type: 'string', example: '662fb1a38f36c53e8d98ef33' },
                  stock: { type: 'integer', example: 5 }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Mahsulot yaratildi', content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } } }
        }
      }
    },
    '/seller/products/{id}': {
      put: {
        tags: ['Seller'],
        summary: 'Sotuvchi o‘z mahsulotini tahrirlashi',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, price: { type: 'number' }, stock: { type: 'integer' } } } } }
        },
        responses: {
          200: { description: 'Yangilandi', content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } } }
        }
      },
      delete: {
        tags: ['Seller'],
        summary: 'Sotuvchi o‘z mahsulotini o‘chirishi',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'O‘chirildi' }
        }
      }
    },
    '/seller/orders': {
      get: {
        tags: ['Seller'],
        summary: 'Sotuvchining mahsulotlariga tushgan buyurtmalar',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Buyurtmalar ro‘yxati',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Order' } } } }
          }
        }
      }
    },
    '/seller/orders/{id}/status': {
      patch: {
        tags: ['Seller'],
        summary: 'Sotuvchi tomonidan buyurtma statusini o‘zgartirish',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', required: ['status'], properties: { status: { type: 'string', example: 'processing' } } } } }
        },
        responses: {
          200: { description: 'Status yangilandi' }
        }
      }
    },
    '/seller/analytics': {
      get: {
        tags: ['Seller'],
        summary: 'Oylik savdo tahlili (Analytics)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Oylar bo‘yicha savdo statistikasi',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      _id: { type: 'integer', description: 'Oy raqami (1-12)', example: 4 },
                      total: { type: 'number', description: 'Jami savdo summasi', example: 12500000 }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/seller/store': {
      get: {
        tags: ['Seller'],
        summary: 'Sotuvchining do‘kon ma’lumotlarini olish',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Do‘kon ma’lumotlari', content: { 'application/json': { schema: { $ref: '#/components/schemas/Store' } } } },
          404: { description: 'Do‘kon hali yaratilmagan' }
        }
      },
      post: {
        tags: ['Seller'],
        summary: 'Yangi do‘kon ochish (Logo rasm bilan birga)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'Electro Store' },
                  description: { type: 'string', example: 'Sifatli gadjetlar do‘koni' },
                  phone: { type: 'string', example: '+998901234567' },
                  address: { type: 'string', example: 'Toshkent sh.' },
                  logo: { type: 'string', format: 'binary' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Do‘kon yaratildi', content: { 'application/json': { schema: { $ref: '#/components/schemas/Store' } } } }
        }
      },
      put: {
        tags: ['Seller'],
        summary: 'Do‘kon ma’lumotlarini yangilash',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  phone: { type: 'string' },
                  address: { type: 'string' },
                  logo: { type: 'string', format: 'binary' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Do‘kon yangilandi', content: { 'application/json': { schema: { $ref: '#/components/schemas/Store' } } } }
        }
      }
    },

    // ----------------------------------------------------
    // ADMIN
    // ----------------------------------------------------
    '/admin/overview': {
      get: {
        tags: ['Admin'],
        summary: 'Admin boshqaruv paneli umumiy statistikasi',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Statistika',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    users: { type: 'integer', example: 1500 },
                    sellers: { type: 'integer', example: 45 },
                    products: { type: 'integer', example: 320 },
                    orders: { type: 'integer', example: 850 }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/admin/users': {
      get: {
        tags: ['Admin'],
        summary: 'Barcha foydalanuvchilar ro‘yxati',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Foydalanuvchilar',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/User' } } } }
          }
        }
      }
    },
    '/admin/users/{id}/role': {
      patch: {
        tags: ['Admin'],
        summary: 'Foydalanuvchi rolini o‘zgartirish',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['role'],
                properties: {
                  role: { type: 'string', enum: ['user', 'seller', 'admin'], example: 'seller' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Rol yangilandi', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } }
        }
      }
    },
    '/admin/sellers': {
      get: {
        tags: ['Admin'],
        summary: 'Barcha do‘konlar va sotuvchilar ro‘yxati',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Sotuvchilar ro‘yxati',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Store' } } } }
          }
        }
      }
    },
    '/admin/sellers/{id}/approve': {
      patch: {
        tags: ['Admin'],
        summary: 'Sotuvchi arizasini tasdiqlash yoki rad etish',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Sotuvchi User ID' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['approved'],
                properties: {
                  approved: { type: 'boolean', example: true }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Sotuvchi statusi yangilandi' }
        }
      }
    },
    '/admin/products': {
      get: {
        tags: ['Admin'],
        summary: 'Barcha mahsulotlar (Admin ko‘rinishi)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Mahsulotlar',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Product' } } } }
          }
        }
      },
      post: {
        tags: ['Admin'],
        summary: 'Admin nomidan yangi mahsulot qo‘shish',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'price', 'category'],
                properties: {
                  name: { type: 'string', example: 'iPhone 15 Pro Max' },
                  description: { type: 'string', example: 'Titan korpus, 256GB' },
                  price: { type: 'number', example: 14500000 },
                  oldPrice: { type: 'number', example: 16000000 },
                  category: { type: 'string', example: 'smartfonlar' },
                  stock: { type: 'integer', example: 20 },
                  image: { type: 'string', example: '/uploads/iphone15.jpg' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Mahsulot yaratildi', content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } } }
        }
      }
    },
    '/admin/products/{id}': {
      put: {
        tags: ['Admin'],
        summary: 'Admin tomonidan mahsulotni to‘liq yangilash',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, price: { type: 'number' }, stock: { type: 'integer' } } } } }
        },
        responses: {
          200: { description: 'Yangilandi', content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } } }
        }
      },
      delete: {
        tags: ['Admin'],
        summary: 'Admin tomonidan mahsulotni o‘chirish',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'O‘chirildi' }
        }
      }
    },
    '/admin/products/{id}/status': {
      patch: {
        tags: ['Admin'],
        summary: 'Mahsulot statusini o‘zgartirish (active, draft, archived)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: { type: 'string', enum: ['active', 'draft', 'archived'], example: 'active' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Status yangilandi' }
        }
      }
    },
    '/admin/banners': {
      get: {
        tags: ['Admin'],
        summary: 'Barcha bannerlar ro‘yxati (faol va nofaol)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Bannerlar', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Banner' } } } } }
        }
      },
      post: {
        tags: ['Admin'],
        summary: 'Yangi banner qo‘shish',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'image'],
                properties: {
                  title: { type: 'string', example: 'Katta chegirmalar' },
                  image: { type: 'string', example: '/uploads/banner-1.jpg' },
                  link: { type: 'string', example: '/products' },
                  position: { type: 'string', example: 'home_main' },
                  isActive: { type: 'boolean', example: true },
                  order: { type: 'integer', example: 1 }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Banner yaratildi', content: { 'application/json': { schema: { $ref: '#/components/schemas/Banner' } } } }
        }
      }
    },
    '/admin/banners/{id}': {
      put: {
        tags: ['Admin'],
        summary: 'Bannerni tahrirlash',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { title: { type: 'string' }, image: { type: 'string' }, isActive: { type: 'boolean' }, order: { type: 'integer' } } } } }
        },
        responses: {
          200: { description: 'Banner yangilandi' }
        }
      },
      delete: {
        tags: ['Admin'],
        summary: 'Bannerni o‘chirish',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Banner o‘chirildi' }
        }
      }
    },
    '/admin/settings': {
      put: {
        tags: ['Admin'],
        summary: 'Tizim sozlamalarini yangilash',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  siteName: { type: 'string', example: 'Lumo Market V3' },
                  contactEmail: { type: 'string', example: 'admin@lumomarket.uz' },
                  contactPhone: { type: 'string', example: '+998712000000' },
                  feePercentage: { type: 'number', example: 5 },
                  maintenanceMode: { type: 'boolean', example: false }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Sozlamalar yangilandi', content: { 'application/json': { schema: { $ref: '#/components/schemas/Settings' } } } }
        }
      }
    },
    '/admin/orders': {
      get: {
        tags: ['Admin'],
        summary: 'Barcha tizimdagi buyurtmalar',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Buyurtmalar',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Order' } } } }
          }
        }
      }
    },
    '/admin/reports': {
      get: {
        tags: ['Admin'],
        summary: 'Oylik daromad va moliyaviy hisobotlar',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Hisobotlar',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      _id: { type: 'integer', example: 4 },
                      total: { type: 'number', example: 45000000 }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/admin/upload': {
      post: {
        tags: ['Admin'],
        summary: 'Fayl / Rasm yuklash (Single File upload)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['image'],
                properties: {
                  image: { type: 'string', format: 'binary', description: 'Yuklanadigan rasm fayli' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Rasm yuklandi',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    url: { type: 'string', example: '/uploads/image-1714392812000.jpg' }
                  }
                }
              }
            }
          }
        }
      }
    },

    // ----------------------------------------------------
    // BANNERS (PUBLIC)
    // ----------------------------------------------------
    '/banners': {
      get: {
        tags: ['Banners'],
        summary: 'Barcha faol bannerlar ro‘yxati (Public)',
        responses: {
          200: {
            description: 'Faol bannerlar',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Banner' } } } }
          }
        }
      }
    },

    // ----------------------------------------------------
    // SETTINGS (PUBLIC)
    // ----------------------------------------------------
    '/settings': {
      get: {
        tags: ['Settings'],
        summary: 'Sayt umumiy sozlamalarini olish (Public)',
        responses: {
          200: {
            description: 'Sayt sozlamalari',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Settings' } } }
          }
        }
      }
    },

    // ----------------------------------------------------
    // HEALTH
    // ----------------------------------------------------
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'API holatini tekshirish',
        responses: {
          200: {
            description: 'API ishchi holatda',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    app: { type: 'string', example: 'Lumo Market V3' }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

export const swaggerUiOptions = {
  customCss: `
    .swagger-ui .topbar { background-color: #1e293b; padding: 10px 0; }
    .swagger-ui .info { margin: 20px 0; }
    .swagger-ui .info .title { color: #0f172a; font-weight: 700; font-family: system-ui, sans-serif; }
    .swagger-ui .btn.authorize { background-color: #6366f1; color: white; border-color: #6366f1; }
    .swagger-ui .btn.authorize svg { fill: white; }
    .swagger-ui .opblock.opblock-post { border-color: #10b981; background: rgba(16, 185, 129, 0.05); }
    .swagger-ui .opblock.opblock-get { border-color: #3b82f6; background: rgba(59, 130, 246, 0.05); }
    .swagger-ui .opblock.opblock-put { border-color: #f59e0b; background: rgba(245, 158, 11, 0.05); }
    .swagger-ui .opblock.opblock-delete { border-color: #ef4444; background: rgba(239, 68, 68, 0.05); }
  `,
  customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css',
  customJs: [
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.js',
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.js'
  ],
  customSiteTitle: 'Lumo Marketplace API - Swagger Documentation',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'list',
    filter: true
  }
};

export const renderSwaggerHTML = (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lumo Marketplace API - Swagger Documentation</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css" />
  <link rel="icon" type="image/png" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/favicon-32x32.png" />
  <style>
    body { margin: 0; padding: 0; background: #fafafa; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    .swagger-ui .topbar { background-color: #0f172a; padding: 12px 0; border-bottom: 2px solid #6366f1; }
    .swagger-ui .topbar-wrapper .link { color: #fff; font-weight: 700; font-size: 20px; text-decoration: none; display: flex; align-items: center; }
    .swagger-ui .info { margin: 24px 0; }
    .swagger-ui .info .title { color: #0f172a; font-weight: 800; }
    .swagger-ui .btn.authorize { background-color: #6366f1; color: white; border-color: #6366f1; }
    .swagger-ui .btn.authorize svg { fill: white; }
    .swagger-ui .opblock.opblock-post { border-color: #10b981; background: rgba(16, 185, 129, 0.05); }
    .swagger-ui .opblock.opblock-get { border-color: #3b82f6; background: rgba(59, 130, 246, 0.05); }
    .swagger-ui .opblock.opblock-put { border-color: #f59e0b; background: rgba(245, 158, 11, 0.05); }
    .swagger-ui .opblock.opblock-delete { border-color: #ef4444; background: rgba(239, 68, 68, 0.05); }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.min.js"></script>
  <script>
    window.onload = function() {
      const spec = ${JSON.stringify(swaggerSpec)};
      window.ui = SwaggerUIBundle({
        spec: spec,
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout",
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: 'list',
        filter: true
      });
    };
  </script>
</body>
</html>`);
};

