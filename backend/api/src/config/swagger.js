/**
 * Swagger/OpenAPI Configuration
 */

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MTRX Pay API',
      version: '1.0.0',
      description: 'Payment platform API for merchant onboarding and management',
      contact: {
        name: 'MTRX Pay Support',
        email: 'support@mtrxpay.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token from /api/auth/login'
        }
      },
      schemas: {
        // Common response schemas
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'object' },
            message: { type: 'string' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: {
              type: 'object',
              additionalProperties: { type: 'string' }
            }
          }
        },
        ValidationError: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Validation failed' },
            errors: {
              type: 'object',
              example: {
                legalBusinessName: 'Required',
                businessType: 'Must be one of: sole_trader, limited_company, llp, partnership, plc'
              }
            }
          }
        },

        // User schemas
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            full_name: { type: 'string' },
            role: { type: 'string', enum: ['merchant', 'admin'] },
            merchant_id: { type: 'string', format: 'uuid', nullable: true },
            created_at: { type: 'string', format: 'date-time' }
          }
        },

        // Merchant schemas
        Merchant: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            owner_user_id: { type: 'string', format: 'uuid' },
            legal_business_name: { type: 'string' },
            trading_name: { type: 'string', nullable: true },
            business_type: {
              type: 'string',
              enum: ['sole_trader', 'limited_company', 'llp', 'partnership', 'plc']
            },
            country_of_incorporation: { type: 'string' },
            registration_number: { type: 'string', nullable: true },
            vat_number: { type: 'string', nullable: true },
            industry_type: { type: 'string', nullable: true },
            business_description: { type: 'string', nullable: true },
            website_url: { type: 'string', nullable: true },
            status: {
              type: 'string',
              enum: ['draft', 'pending_submission', 'under_review', 'approved', 'rejected', 'suspended']
            },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        MerchantCreate: {
          type: 'object',
          required: ['legalBusinessName', 'businessType', 'countryOfIncorporation'],
          properties: {
            legalBusinessName: {
              type: 'string',
              minLength: 2,
              maxLength: 255,
              example: 'Acme Corporation Ltd'
            },
            tradingName: {
              type: 'string',
              maxLength: 255,
              example: 'Acme Corp'
            },
            businessType: {
              type: 'string',
              enum: ['sole_trader', 'limited_company', 'llp', 'partnership', 'plc'],
              example: 'limited_company'
            },
            countryOfIncorporation: {
              type: 'string',
              example: 'United Kingdom'
            },
            registrationNumber: {
              type: 'string',
              example: '12345678'
            }
          }
        },
        MerchantUpdate: {
          type: 'object',
          properties: {
            tradingName: { type: 'string', example: 'Acme Corp' },
            industryType: { type: 'string', example: 'technology' },
            businessDescription: { type: 'string', example: 'Software development services' },
            websiteUrl: { type: 'string', format: 'uri', example: 'https://acme.com' },
            vatNumber: { type: 'string', example: 'GB123456789' },
            phoneNumber: { type: 'string', example: '+44 20 1234 5678' }
          }
        },

        // Address schemas
        Address: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            merchant_id: { type: 'string', format: 'uuid' },
            address_type: { type: 'string', enum: ['registered', 'trading', 'billing'] },
            address_line1: { type: 'string' },
            address_line2: { type: 'string', nullable: true },
            city: { type: 'string' },
            state: { type: 'string', nullable: true },
            postcode: { type: 'string' },
            country: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        AddressCreate: {
          type: 'object',
          required: ['addressType', 'addressLine1', 'city', 'postcode', 'country'],
          properties: {
            addressType: {
              type: 'string',
              enum: ['registered', 'trading', 'billing'],
              example: 'registered'
            },
            addressLine1: { type: 'string', example: '123 Business Street' },
            addressLine2: { type: 'string', example: 'Suite 100' },
            city: { type: 'string', example: 'London' },
            state: { type: 'string', example: 'Greater London' },
            postcode: { type: 'string', example: 'SW1A 1AA' },
            country: { type: 'string', example: 'United Kingdom' }
          }
        },

        // Owner schemas
        Owner: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            merchant_id: { type: 'string', format: 'uuid' },
            first_name: { type: 'string' },
            last_name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string', nullable: true },
            date_of_birth: { type: 'string', format: 'date', nullable: true },
            nationality: { type: 'string', nullable: true },
            role: { type: 'string', enum: ['director', 'shareholder', 'ubo', 'partner'] },
            ownership_percentage: { type: 'number', minimum: 0, maximum: 100 },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        OwnerCreate: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'role'],
          properties: {
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Smith' },
            email: { type: 'string', format: 'email', example: 'john.smith@acme.com' },
            phone: { type: 'string', example: '+44 7700 900000' },
            dateOfBirth: { type: 'string', format: 'date', example: '1985-06-15' },
            nationality: { type: 'string', example: 'British' },
            role: {
              type: 'string',
              enum: ['director', 'shareholder', 'ubo', 'partner'],
              example: 'director'
            },
            ownershipPercentage: { type: 'number', example: 50 }
          }
        },

        // Document schemas
        Document: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            merchant_id: { type: 'string', format: 'uuid' },
            document_type: {
              type: 'string',
              enum: ['id_proof', 'address_proof', 'business_registration', 'bank_statement']
            },
            file_name: { type: 'string' },
            file_size: { type: 'integer' },
            mime_type: { type: 'string' },
            status: { type: 'string', enum: ['uploaded', 'pending_review', 'approved', 'rejected'] },
            upload_url: { type: 'string', nullable: true },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        DocumentCreate: {
          type: 'object',
          required: ['documentType', 'fileName'],
          properties: {
            documentType: {
              type: 'string',
              enum: ['id_proof', 'address_proof', 'business_registration', 'bank_statement'],
              example: 'id_proof'
            },
            fileName: { type: 'string', example: 'passport.pdf' },
            fileSize: { type: 'integer', example: 102400 },
            mimeType: { type: 'string', example: 'application/pdf' }
          }
        },

        // Progress schemas
        Progress: {
          type: 'object',
          properties: {
            merchantId: { type: 'string', format: 'uuid' },
            currentStep: {
              type: 'string',
              enum: ['business_details', 'address', 'owners', 'documents', 'review']
            },
            completionPercent: { type: 'integer', minimum: 0, maximum: 100 },
            canSubmit: { type: 'boolean' },
            isSubmitted: { type: 'boolean' },
            missingItems: {
              type: 'array',
              items: { type: 'string' }
            },
            sectionDetails: {
              type: 'object',
              properties: {
                account: { $ref: '#/components/schemas/SectionStatus' },
                profile: { $ref: '#/components/schemas/SectionStatus' },
                address: { $ref: '#/components/schemas/SectionStatus' },
                owners: { $ref: '#/components/schemas/SectionStatus' },
                documents: { $ref: '#/components/schemas/SectionStatus' },
                submitted: { $ref: '#/components/schemas/SectionStatus' }
              }
            }
          }
        },
        SectionStatus: {
          type: 'object',
          properties: {
            complete: { type: 'boolean' },
            label: { type: 'string' },
            missing: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        },

        // Submission schemas
        SubmissionResult: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                merchantId: { type: 'string', format: 'uuid' },
                status: { type: 'string', example: 'under_review' },
                submittedAt: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        SubmissionValidation: {
          type: 'object',
          properties: {
            valid: { type: 'boolean' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        },

        // Admin schemas
        ReviewAction: {
          type: 'object',
          properties: {
            notes: { type: 'string', example: 'All documents verified successfully' },
            riskLevel: { type: 'string', enum: ['low', 'medium', 'high'] }
          }
        },
        RejectAction: {
          type: 'object',
          required: ['reason'],
          properties: {
            reason: { type: 'string', example: 'Invalid business registration document' },
            notes: { type: 'string', example: 'Document appears to be expired' },
            allowResubmission: { type: 'boolean', default: true }
          }
        },
        RequestInfoAction: {
          type: 'object',
          required: ['requestedItems'],
          properties: {
            requestedItems: {
              type: 'array',
              items: { type: 'string' },
              example: ['Updated ID proof', 'Recent bank statement']
            },
            message: { type: 'string', example: 'Please provide updated documents' }
          }
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/modules/**/routes.js', './src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
