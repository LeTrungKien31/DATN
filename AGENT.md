**# AGENT.md**



**## 1. Tổng quan dự án**



Tên dự án: **\*\*English Assessment AI\*\***



Đây là đồ án tốt nghiệp xây dựng hệ thống đánh giá năng lực tiếng Anh có tích hợp AI hỗ trợ tạo đề, phân tích kết quả và đề xuất lộ trình học tập.



Mục tiêu chính:



\- Đánh giá năng lực tiếng Anh của người học.

\- Hỗ trợ nhiều kỹ năng:

  - Grammar

  - Vocabulary

  - Reading

  - Listening

  - Speaking

  - Writing

\- Ước lượng trình độ CEFR từ A1 đến C2.

\- Cho phép giáo viên hoặc quản trị viên quản lý câu hỏi và đề thi.

\- Sử dụng AI để tạo câu hỏi.

\- Sử dụng AI để phân tích điểm mạnh, điểm yếu của người học.

\- Gợi ý lộ trình học tập cá nhân hóa.

\- Lưu lịch sử làm bài và kết quả chi tiết theo từng kỹ năng.

\- Có thể phát triển Adaptive Testing trong giai đoạn sau.



**---**



**## 2. Công nghệ sử dụng**



**### Frontend**



\- ReactJS

\- Vite

\- React Router

\- Axios

\- Context API

\- Recharts

\- Tailwind CSS hoặc Ant Design



**### Backend**



\- Node.js

\- Express.js

\- JavaScript

\- REST API

\- JWT Authentication

\- bcrypt



**### Cơ sở dữ liệu**



\- MongoDB

\- Mongoose ODM



**### AI**



Ưu tiên sử dụng một trong các dịch vụ:



\- OpenAI API

\- Gemini API



Toàn bộ việc gọi AI phải được thực hiện ở backend.



Không được gọi trực tiếp API AI từ frontend.



**---**



**## 3. Cấu trúc dự án**



\`\`\`text

english-assessment-ai/

|

\|-- frontend/

\|   |-- public/

\|   \`-- src/

\|       |-- assets/

\|       |-- components/

\|       |-- pages/

\|       |-- services/

\|       |-- context/

\|       |-- hooks/

\|       |-- routes/

\|       |-- utils/

\|       |-- App.jsx

\|       \`-- main.jsx

|

\|-- backend/

\|   \`-- src/

\|       |-- config/

\|       |-- controllers/

\|       |-- routes/

\|       |-- services/

\|       |-- middleware/

\|       |-- validators/

\|       |-- models/

\|       |-- utils/

\|       |-- app.js

\|       \`-- server.js

|

\|-- docs/

\|-- AGENT.md

\|-- README.md

\`-- .gitignore

\`\`\`



Không tạo thêm thư mục cấp cao nếu không thực sự cần thiết.



**---**



**## 4. Nguyên tắc chung khi Codex chỉnh sửa dự án**



Khi làm việc trong repository này, Codex phải:



1\. Đọc các file liên quan trước khi tạo hoặc sửa code.

2\. Tôn trọng kiến trúc hiện tại của dự án.

3\. Chỉ thay đổi những phần thật sự liên quan đến yêu cầu.

4\. Không tự ý rewrite toàn bộ project.

5\. Không tạo logic trùng lặp.

6\. Không đặt business logic trong file route.

7\. Không truy cập MongoDB trực tiếp trong route.

8\. Controller phải gọn.

9\. Business logic phải nằm trong service.

10\. MongoDB phải được thao tác thông qua Mongoose.

11\. Ưu tiên async/await.

12\. Phải xử lý lỗi rõ ràng.

13\. Không hard-code password, secret, API key hoặc connection string.

14\. Không để frontend biết secret của backend.

15\. Ưu tiên code dễ đọc, dễ bảo trì.



Trước khi tạo một file mới, cần kiểm tra xem file có chức năng tương tự đã tồn tại hay chưa.



**---**



**## 5. Kiến trúc backend**



Luồng xử lý chuẩn:



\`\`\`text

Route

  |

  v

Middleware

  |

  v

Controller

  |

  v

Service

  |

  v

Mongoose Model

  |

  v

MongoDB

\`\`\`



Ví dụ:



\`\`\`text

POST /api/tests/:id/submit

        |

        v

test.routes.js

        |

        v

auth.middleware.js

        |

        v

test.controller.js

        |

        v

grading.service.js

        |

        v

TestAttempt / UserAnswer / Result Models

        |

        v

MongoDB

\`\`\`



**---**



**## 6. Quy tắc cho Route**



Route chỉ chịu trách nhiệm:



\- khai báo endpoint;

\- gắn middleware;

\- gọi controller.



Ví dụ:



\`\`\`js

router.post(

  "/:id/submit",

  authenticate,

  testController.submitTest

);

\`\`\`



Không được đặt:



\- logic chấm điểm;

\- logic AI;

\- truy vấn MongoDB phức tạp;

\- logic nghiệp vụ lớn;



trực tiếp trong route.



**---**



**## 7. Quy tắc cho Controller**



Controller nên:



\- nhận dữ liệu từ request;

\- gọi service;

\- trả response;

\- chuyển lỗi cho error middleware.



Controller không nên chứa nghiệp vụ lớn.



Ví dụ:



\`\`\`js

const submitTest = async (req, res, next) => {

  try {

    const result = await testService.submitTest({

      userId: req.user.id,

      testId: req.params.id,

      answers: req.body.answers,

    });



    return res.status(200).json({

      success: true,

      message: "Nộp bài thành công",

      data: result,

    });

  } catch (error) {

    next(error);

  }

};

\`\`\`



**---**



**## 8. Quy tắc cho Service**



Service là nơi chứa business logic chính.



Ví dụ:



\`\`\`text

auth.service.js

question.service.js

test.service.js

grading.service.js

assessment.service.js

ai.service.js

\`\`\`



Các logic sau phải ưu tiên đặt trong service:



\- đăng nhập;

\- đăng ký;

\- tạo đề;

\- chấm điểm;

\- tính điểm theo kỹ năng;

\- đánh giá CEFR;

\- gọi AI;

\- lưu kết quả;

\- sinh đề thích ứng.



**---**



**## 9. API Convention**



Base API:



\`\`\`text

/api

\`\`\`



Các endpoint chính:



\`\`\`text

/api/auth

/api/users

/api/questions

/api/tests

/api/results

/api/ai

\`\`\`



Ví dụ:



\`\`\`text

POST   /api/auth/register

POST   /api/auth/login



GET    /api/questions

GET    /api/questions/:id

POST   /api/questions

PUT    /api/questions/:id

DELETE /api/questions/:id



GET    /api/tests

GET    /api/tests/:id

POST   /api/tests

PUT    /api/tests/:id

DELETE /api/tests/:id



POST   /api/tests/:id/start

POST   /api/tests/:id/submit



GET    /api/results/me

GET    /api/results/:attemptId



POST   /api/ai/generate-questions

POST   /api/ai/analyze-result

\`\`\`



Ưu tiên RESTful API.



**---**



**## 10. Format response API**



Response thành công:



\`\`\`json

{

  "success": true,

  "message": "Thao tác thành công",

  "data": {}

}

\`\`\`



Response lỗi:



\`\`\`json

{

  "success": false,

  "message": "Dữ liệu không hợp lệ",

  "errors": []

}

\`\`\`



Không trả raw stack trace ra client ở môi trường production.



Mã HTTP thường dùng:



\`\`\`text

200 OK

201 Created

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

422 Unprocessable Entity

500 Internal Server Error

\`\`\`



**---**



**## 11. Authentication và Authorization**



Sử dụng JWT.



Quy tắc password:



\- Không lưu password dạng plain text.

\- Phải hash password bằng bcrypt.

\- Không trả passwordHash trong API response.



Role đề xuất:



\`\`\`text

STUDENT

TEACHER

ADMIN

\`\`\`



Quyền cơ bản:



\`\`\`text

STUDENT

\- Làm bài kiểm tra

\- Xem kết quả cá nhân

\- Xem gợi ý học tập



TEACHER

\- Tạo câu hỏi

\- Tạo đề thi

\- Sinh câu hỏi bằng AI

\- Duyệt câu hỏi do AI tạo



ADMIN

\- Quản lý người dùng

\- Quản lý đề thi

\- Quản lý câu hỏi

\- Xem thống kê hệ thống

\`\`\`



Authorization phải được kiểm tra ở backend.



Không được chỉ dựa vào việc ẩn nút hoặc route ở frontend.



**---**



**## 12. MongoDB và Mongoose**



MongoDB là cơ sở dữ liệu chính.



Mongoose là ODM chính.



Connection nên đặt tại:



\`\`\`text

backend/src/config/database.js

\`\`\`



Ví dụ:



\`\`\`js

import mongoose from "mongoose";



export const connectDatabase = async () => {

  await mongoose.connect(process.env.MONGODB_URI);

};

\`\`\`



Không gọi \`mongoose.connect()\` rải rác ở nhiều file.



**---**



**## 13. Các Model chính**



Các model dự kiến:



\`\`\`text

User

Question

Test

TestAttempt

Result

AiGenerationLog

\`\`\`



Có thể bổ sung:



\`\`\`text

Skill

CefrLevel

UserAnswer

LearningRecommendation

\`\`\`



Tuy nhiên với MongoDB, không bắt buộc phải tách mọi thứ thành collection riêng.



Cần lựa chọn hợp lý giữa:



\- Embedding

\- Referencing



dựa trên quan hệ dữ liệu và tần suất truy xuất.



**---**



**## 14. Quy tắc thiết kế MongoDB**



Ưu tiên **\*\*embedding\*\*** khi:



\- dữ liệu luôn được đọc cùng nhau;

\- dữ liệu con có số lượng nhỏ;

\- dữ liệu con không cần truy vấn độc lập nhiều.



Ưu tiên **\*\*referencing\*\*** khi:



\- dữ liệu được dùng ở nhiều nơi;

\- dữ liệu có thể rất lớn;

\- dữ liệu cần truy vấn độc lập;

\- nhiều document cần dùng chung cùng một dữ liệu.



Không nhúng dữ liệu vô hạn vào một document.



Cần chú ý giới hạn document MongoDB là 16 MB.



**---**



**## 15. Gợi ý thiết kế Question Model**



Ví dụ:



\`\`\`js

const questionSchema = new mongoose.Schema(

  {

    content: {

      type: String,

      required: true,

      trim: true,

    },



    type: {

      type: String,

      enum: [

        "MULTIPLE_CHOICE",

        "TRUE_FALSE",

        "FILL_IN_BLANK",

        "READING",

        "LISTENING",

        "SPEAKING",

        "WRITING",

      ],

      required: true,

    },



    skill: {

      type: String,

      enum: [

        "GRAMMAR",

        "VOCABULARY",

        "READING",

        "LISTENING",

        "SPEAKING",

        "WRITING",

      ],

      required: true,

    },



    cefrLevel: {

      type: String,

      enum: ["A1", "A2", "B1", "B2", "C1", "C2"],

      required: true,

    },



    options: [

      {

        content: String,

        isCorrect: Boolean,

      },

    ],



    explanation: String,



    isAiGenerated: {

      type: Boolean,

      default: false,

    },



    status: {

      type: String,

      enum: ["DRAFT", "ACTIVE", "INACTIVE"],

      default: "DRAFT",

    },



    createdBy: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

    },

  },

  {

    timestamps: true,

  }

);

\`\`\`



Với câu hỏi trắc nghiệm, có thể embedding options trực tiếp trong Question vì options thường luôn đi cùng question.



**---**



**## 16. Gợi ý thiết kế User Model**



User nên có các field cơ bản:



\`\`\`text

\_id

fullName

email

passwordHash

role

isActive

createdAt

updatedAt

\`\`\`



Ví dụ:



\`\`\`js

const userSchema = new mongoose.Schema(

  {

    fullName: {

      type: String,

      required: true,

      trim: true,

    },



    email: {

      type: String,

      required: true,

      unique: true,

      lowercase: true,

      trim: true,

    },



    passwordHash: {

      type: String,

      required: true,

    },



    role: {

      type: String,

      enum: ["STUDENT", "TEACHER", "ADMIN"],

      default: "STUDENT",

    },



    isActive: {

      type: Boolean,

      default: true,

    },

  },

  {

    timestamps: true,

  }

);

\`\`\`



Không trả \`passwordHash\` ra frontend.



**---**



**## 17. Gợi ý thiết kế Test Model**



Test có thể chứa:



\`\`\`text

title

description

duration

status

createdBy

sections

\`\`\`



Có thể tham chiếu đến Question bằng ObjectId.



Ví dụ:



\`\`\`js

const testSchema = new mongoose.Schema(

  {

    title: {

      type: String,

      required: true,

    },



    description: String,



    duration: {

      type: Number,

      required: true,

    },



    status: {

      type: String,

      enum: ["DRAFT", "ACTIVE", "INACTIVE"],

      default: "DRAFT",

    },



    questions: [

      {

        questionId: {

          type: mongoose.Schema.Types.ObjectId,

          ref: "Question",

          required: true,

        },



        order: Number,

        score: Number,

      },

    ],



    createdBy: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

    },

  },

  {

    timestamps: true,

  }

);

\`\`\`



**---**



**## 18. Gợi ý thiết kế TestAttempt**



TestAttempt dùng để lưu một lần làm bài của user.



Có thể chứa:



\`\`\`text

userId

testId

startedAt

submittedAt

status

answers

totalScore

estimatedCefr

skillScores

\`\`\`



Ví dụ:



\`\`\`js

const testAttemptSchema = new mongoose.Schema(

  {

    userId: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,

      index: true,

    },



    testId: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "Test",

      required: true,

      index: true,

    },



    status: {

      type: String,

      enum: ["IN_PROGRESS", "SUBMITTED"],

      default: "IN_PROGRESS",

    },



    startedAt: {

      type: Date,

      default: Date.now,

    },



    submittedAt: Date,



    answers: [

      {

        questionId: {

          type: mongoose.Schema.Types.ObjectId,

          ref: "Question",

        },



        selectedOptionIndex: Number,



        textAnswer: String,



        isCorrect: Boolean,



        score: Number,

      },

    ],



    skillScores: [

      {

        skill: String,

        score: Number,

        cefrLevel: String,

      },

    ],



    totalScore: Number,



    estimatedCefrLevel: String,

  },

  {

    timestamps: true,

  }

);

\`\`\`



Với MongoDB, việc embedding answers vào TestAttempt là hợp lý nếu số lượng câu hỏi trong mỗi bài thi không quá lớn.



**---**



**## 19. CEFR**



Các mức:



\`\`\`text

A1

A2

B1

B2

C1

C2

\`\`\`



Ứng dụng cần hỗ trợ đánh giá riêng theo kỹ năng.



Ví dụ:



\`\`\`text

Grammar

Vocabulary

Reading

Listening

Speaking

Writing

\`\`\`



Không được suy ra CEFR của user chỉ từ một câu hỏi.



Logic tính CEFR phải đặt trong:



\`\`\`text

backend/src/services/assessment.service.js

\`\`\`



Ưu tiên logic xác định rõ ràng, có quy tắc.



Không nên dùng AI để thay thế hoàn toàn logic chấm điểm khách quan.



**---**



**## 20. AI Integration**



Toàn bộ logic AI phải đặt trong:



\`\`\`text

backend/src/services/ai.service.js

\`\`\`



Không để prompt dài trực tiếp trong controller.



Khi prompt trở nên phức tạp, có thể tạo:



\`\`\`text

backend/src/services/prompts/

\`\`\`



hoặc helper tương đương.



Không để API key AI ở frontend.



Luồng chuẩn:



\`\`\`text

React

  |

  v

Backend API

  |

  v

AI Controller

  |

  v

AI Service

  |

  v

OpenAI / Gemini

\`\`\`



**---**



**## 21. Chức năng AI dự kiến**



AI có thể hỗ trợ:



1\. Tạo câu hỏi.

2\. Tạo giải thích đáp án.

3\. Phân tích điểm mạnh, điểm yếu.

4\. Đề xuất lộ trình học.

5\. Đánh giá Writing.

6\. Hỗ trợ đánh giá Speaking.

7\. Sinh câu hỏi theo độ khó thích ứng.

8\. Sinh câu hỏi theo CEFR.

9\. Sinh câu hỏi theo kỹ năng.

10\. Sinh câu hỏi theo chủ đề.



**---**



**## 22. Format AI tạo câu hỏi**



Ưu tiên bắt AI trả về JSON có cấu trúc.



Ví dụ:



\`\`\`json

{

  "questions": [

    {

      "content": "If I \_\_\_ enough money, I would travel to Japan.",

      "type": "MULTIPLE_CHOICE",

      "skill": "GRAMMAR",

      "cefrLevel": "B1",

      "options": [

        {

          "content": "have",

          "isCorrect": false

        },

        {

          "content": "had",

          "isCorrect": true

        },

        {

          "content": "will have",

          "isCorrect": false

        },

        {

          "content": "having",

          "isCorrect": false

        }

      ],

      "explanation": "The second conditional uses the past simple in the if-clause."

    }

  ]

}

\`\`\`



Phải validate dữ liệu AI trước khi lưu vào MongoDB.



Không được tin tuyệt đối dữ liệu trả về từ AI.



Cần kiểm tra:



\- content có tồn tại;

\- type hợp lệ;

\- skill hợp lệ;

\- cefrLevel hợp lệ;

\- số lượng options;

\- chỉ có đáp án đúng hợp lệ;

\- explanation có kiểu dữ liệu phù hợp.



**---**



**## 23. Quy trình câu hỏi AI**



Câu hỏi do AI sinh ra không nên tự động xuất bản.



Quy trình đề xuất:



\`\`\`text

AI tạo câu hỏi

      |

      v

Lưu status = DRAFT

      |

      v

Teacher/Admin kiểm tra

      |

      v

Approve

      |

      v

status = ACTIVE

\`\`\`



Field:



\`\`\`text

isAiGenerated = true

status = DRAFT

\`\`\`



**---**



**## 24. AI Generation Log**



Nên lưu lịch sử gọi AI nếu cần phục vụ báo cáo và quản trị.



Model có thể gồm:



\`\`\`text

userId

provider

model

purpose

prompt

response

status

tokensUsed

createdAt

\`\`\`



Ví dụ:



\`\`\`js

const aiGenerationLogSchema = new mongoose.Schema(

  {

    userId: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

    },



    provider: String,



    model: String,



    purpose: String,



    prompt: String,



    response: mongoose.Schema.Types.Mixed,



    status: String,



    tokensUsed: Number,

  },

  {

    timestamps: true,

  }

);

\`\`\`



Không được log API key.



Hạn chế lưu dữ liệu người dùng nhạy cảm nếu không cần thiết.



**---**



**## 25. Frontend Architecture**



Phân chia:



\`\`\`text

pages/

    Component cấp trang



components/

    Component UI tái sử dụng



services/

    Hàm gọi API



context/

    Shared state



hooks/

    Custom React hooks



routes/

    Routing



utils/

    Helper và constants

\`\`\`



Không viết toàn bộ Axios logic trực tiếp trong page.



Ví dụ:



\`\`\`text

TakeTest.jsx

    |

    v

testService.js

    |

    v

Backend API

\`\`\`



**---**



**## 26. Axios Service**



Cấu hình Axios trung tâm ở:



\`\`\`text

frontend/src/services/api.js

\`\`\`



File này nên xử lý:



\- baseURL;

\- Authorization header;

\- timeout;

\- interceptor nếu cần;

\- lỗi response chung.



Các API riêng nên chia:



\`\`\`text

authService.js

testService.js

questionService.js

resultService.js

\`\`\`



Không lặp URL API ở nhiều component.



**---**



**## 27. React Routing**



Public:



\`\`\`text

/login

/register

\`\`\`



Student:



\`\`\`text

/dashboard

/tests

/tests/:id

/tests/:id/take

/results/:attemptId

/learning-path

\`\`\`



Admin / Teacher:



\`\`\`text

/admin

/admin/users

/admin/questions

/admin/tests

/admin/ai-generate

\`\`\`



Sử dụng protected route cho trang cần đăng nhập.



Frontend chỉ hỗ trợ UX.



Backend vẫn phải kiểm tra permission thật.



**---**



**## 28. Environment Variables**



Không commit secret thật.



Frontend:



\`\`\`env

VITE_API_URL=http\://localhost:5000/api

\`\`\`



Backend:



\`\`\`env

PORT=5000



MONGODB_URI=mongodb://127.0.0.1:27017/english_assessment_ai



JWT_SECRET=replace_me

JWT_EXPIRES_IN=7d



OPENAI_API_KEY=

GEMINI_API_KEY=

\`\`\`



\`.env\` phải được ignore trong Git.



Nên có:



\`\`\`text

.env.example

\`\`\`



**---**



**## 29. Error Handling**



Backend nên có error middleware tập trung:



\`\`\`text

backend/src/middleware/error.middleware.js

\`\`\`



Không nên lặp response lỗi ở quá nhiều nơi.



Không trả:



\- MongoDB stack trace;

\- server file path;

\- secret;

\- connection string;



ra client.



Frontend nên hiển thị thông báo thân thiện.



**---**



**## 30. Validation**



Phải validate ở backend.



Các chức năng bắt buộc validate:



\- register;

\- login;

\- tạo câu hỏi;

\- tạo đề;

\- cập nhật đề;

\- nộp bài;

\- cấu hình AI;

\- query pagination;

\- ObjectId.



Ví dụ cần kiểm tra ObjectId:



\`\`\`js

mongoose.Types.ObjectId.isValid(id)

\`\`\`



Không chỉ validate ở frontend.



**---**



**## 31. Naming Convention**



JavaScript:



\`\`\`text

camelCase

\`\`\`



React Component:



\`\`\`text

PascalCase

\`\`\`



Constant:



\`\`\`text

UPPER_SNAKE_CASE

\`\`\`



Backend:



\`\`\`text

auth.controller.js

auth.service.js

auth.routes.js

auth.middleware.js

user.model.js

question.model.js

test.model.js

\`\`\`



React:



\`\`\`text

Login.jsx

QuestionCard.jsx

AdminDashboard.jsx

\`\`\`



Mongoose model:



\`\`\`text

User

Question

Test

TestAttempt

AiGenerationLog

\`\`\`



**---**



**## 32. Style code**



Ưu tiên:



\`\`\`js

const getUserById = async (id) => {

  return User.findById(id);

};

\`\`\`



Không dùng biến không rõ nghĩa:



\`\`\`js

const x = await User.find();

\`\`\`



Nên dùng:



\`\`\`js

const users = await User.find();

\`\`\`



Tránh nested code quá sâu.



Ưu tiên early return.



Không để nhiều đoạn code cũ bị comment trong file.



**---**



**## 33. Security**



Luôn xem xét:



\- hash password;

\- JWT expiration;

\- authorization;

\- validation;

\- CORS;

\- rate limiting;

\- AI rate limiting;

\- input sanitization;

\- NoSQL injection;

\- upload restriction nếu có;

\- giới hạn payload;

\- giới hạn request.



Đặc biệt với MongoDB:



Không truyền trực tiếp toàn bộ \`req.body\` vào query nhạy cảm.



Không làm:



\`\`\`js

User.findOne(req.body);

\`\`\`



Nên làm:



\`\`\`js

User.findOne({

  email: req.body.email,

});

\`\`\`



Cần phòng tránh NoSQL injection.



**---**



**## 34. Index MongoDB**



Nên tạo index cho các field truy vấn thường xuyên.



Ví dụ:



\`\`\`text

User.email

Question.skill

Question.cefrLevel

Question.status

Test.status

TestAttempt.userId

TestAttempt.testId

TestAttempt.createdAt

\`\`\`



Không tạo quá nhiều index không cần thiết.



Index giúp đọc nhanh nhưng làm chậm ghi và tăng dung lượng lưu trữ.



**---**



**## 35. Pagination**



Danh sách lớn bắt buộc nên có pagination.



Ví dụ:



\`\`\`text

GET /api/questions?page=1&limit=20

\`\`\`



Không nên dùng:



\`\`\`js

Question.find()

\`\`\`



để trả toàn bộ hàng chục nghìn document.



Có thể dùng:



\`\`\`js

Question.find(filter)

  .skip((page - 1) \* limit)

  .limit(limit);

\`\`\`



**---**



**## 36. Population**



Dùng \`.populate()\` khi thật sự cần.



Ví dụ:



\`\`\`js

Test.findById(id).populate("questions.questionId");

\`\`\`



Không populate quá sâu hoặc quá nhiều nếu không cần vì có thể ảnh hưởng hiệu năng.



**---**



**## 37. Transaction MongoDB**



Với nghiệp vụ quan trọng có nhiều thao tác ghi liên quan, có thể sử dụng MongoDB transaction.



Ví dụ:



\- nộp bài;

\- lưu answer;

\- lưu score;

\- cập nhật trạng thái attempt.



Sử dụng Mongoose session khi cần atomic operation giữa nhiều collection.



Nếu tất cả dữ liệu có thể lưu hợp lý trong một document bằng embedding, có thể không cần transaction.



**---**



**## 38. Quy trình nộp bài**



Nộp bài là nghiệp vụ quan trọng.



Luồng chuẩn:



\`\`\`text

1\. Xác thực user.

2\. Kiểm tra test tồn tại.

3\. Kiểm tra attempt tồn tại.

4\. Kiểm tra attempt chưa submit.

5\. Validate answers.

6\. Load câu hỏi cần thiết.

7\. Tính đúng/sai.

8\. Tính điểm từng câu.

9\. Tính điểm từng kỹ năng.

10\. Ước lượng CEFR.

11\. Lưu answers.

12\. Lưu totalScore.

13\. Lưu skillScores.

14\. Cập nhật status = SUBMITTED.

15\. Trả kết quả.

\`\`\`



Không được tin \`score\` do frontend gửi lên.



Backend phải là nơi tính điểm chính thức.



**---**



**## 39. Adaptive Testing**



Có thể phát triển sau.



Ý tưởng:



\`\`\`text

Trả lời đúng

     |

     v

Tăng độ khó



Trả lời sai

     |

     v

Giữ hoặc giảm độ khó

\`\`\`



Adaptive logic phải ở:



\`\`\`text

backend/src/services/assessment.service.js

\`\`\`



Không đặt logic chọn độ khó trong React.



Frontend chỉ hiển thị câu hỏi backend trả về.



**---**



**## 40. Writing và Speaking**



**### Writing**



Có thể đánh giá:



\`\`\`text

Grammar

Vocabulary

Coherence

Task Achievement

CEFR Estimate

\`\`\`



**### Speaking**



Có thể đánh giá:



\`\`\`text

Pronunciation

Fluency

Grammar

Vocabulary

CEFR Estimate

\`\`\`



Điểm AI phải được phân biệt với điểm khách quan.



Không được tuyên bố điểm AI tương đương chứng chỉ IELTS, TOEFL hoặc Cambridge nếu hệ thống chưa được kiểm định chính thức.



**---**



**## 41. Thay đổi Database Schema**



Trước khi sửa Mongoose schema:



1\. Đọc schema hiện tại.

2\. Kiểm tra field đã tồn tại chưa.

3\. Đánh giá khả năng ảnh hưởng dữ liệu cũ.

4\. Không tự ý rename field quan trọng.

5\. Không tự ý xóa field.

6\. Cân nhắc migration nếu dữ liệu đã tồn tại.



MongoDB schema linh hoạt nhưng không có nghĩa là được thay đổi tùy ý.



Nếu thay đổi cấu trúc dữ liệu lớn, cần giải thích tác động.



**---**



**## 42. Quy trình làm feature**



Khi được yêu cầu thêm chức năng:



1\. Đọc các file liên quan.

2\. Xác định ảnh hưởng frontend.

3\. Xác định ảnh hưởng backend.

4\. Xác định ảnh hưởng MongoDB.

5\. Tận dụng code hiện tại.

6\. Nếu frontend cần API mới, ưu tiên làm backend trước.

7\. Thêm validation.

8\. Thêm authorization.

9\. Thêm error handling.

10\. Thêm service frontend.

11\. Làm UI.

12\. Kiểm thử full flow.

13\. Cập nhật docs nếu cần.



**---**



**## 43. Các command thường dùng**



Frontend:



\`\`\`bash

cd frontend

npm install

npm run dev

\`\`\`



Backend:



\`\`\`bash

cd backend

npm install

npm run dev

\`\`\`



Nếu dùng nodemon:



\`\`\`bash

npm run dev

\`\`\`



MongoDB local thường dùng:



\`\`\`text

mongodb://127.0.0.1:27017/english_assessment_ai

\`\`\`



Có thể sử dụng MongoDB Atlas khi deploy.



**---**



**## 44. Git Rules**



Không commit:



\`\`\`text

node_modules/

.env

dist/

build/

coverage/

\`\`\`



Không commit:



\- API key;

\- password;

\- MongoDB URI có credential thật;

\- JWT secret.



Commit message nên rõ ràng:



\`\`\`text

feat: thêm chức năng tạo câu hỏi bằng AI

fix: sửa lỗi chấm điểm bài thi

refactor: chuyển logic chấm điểm sang grading service

docs: cập nhật tài liệu API

\`\`\`



**---**



**## 45. Documentation**



Tài liệu nằm trong:



\`\`\`text

docs/

\`\`\`



Gợi ý:



\`\`\`text

docs/database-design/

docs/api-documentation/

docs/diagrams/

docs/report/

\`\`\`



Nếu thay đổi:



\- API;

\- database structure;

\- architecture;



thì cần cập nhật tài liệu tương ứng nếu tài liệu đó đã tồn tại.



**---**



**## 46. Quy tắc riêng cho Codex**



Codex khi làm việc trong project này phải:



\- đọc code trước khi sửa;

\- không tạo dependency không cần thiết;

\- không tự ý đổi stack;

\- không chuyển MongoDB sang PostgreSQL;

\- không thêm Prisma;

\- sử dụng Mongoose;

\- giữ AI ở backend;

\- ưu tiên bảo mật;

\- ưu tiên reuse code;

\- không xóa tính năng cũ nếu không được yêu cầu;

\- không đổi tên file, route hoặc field quan trọng một cách tùy tiện;

\- không rewrite toàn bộ dự án chỉ để làm một thay đổi nhỏ.



Nếu yêu cầu chưa nói rõ một chi tiết nhỏ, Codex nên chọn phương án hợp lý dựa trên kiến trúc hiện tại và tiếp tục triển khai.



Nếu thao tác có tính phá hủy hoặc ảnh hưởng kiến trúc lớn, Codex cần giải thích tác động trước khi thực hiện.



**---**



**## 47. Definition of Done**



Một feature được xem là hoàn thành khi:



\- tuân theo kiến trúc hiện tại;

\- backend có validation;

\- backend có authorization nếu cần;

\- xử lý lỗi đúng;

\- Mongoose schema hợp lý;

\- không làm hỏng dữ liệu cũ;

\- frontend gọi API qua service;

\- không lộ secret;

\- code dễ đọc;

\- chức năng chạy end-to-end;

\- docs được cập nhật nếu có thay đổi quan trọng.



**---**



**## 48. Kiến trúc tổng thể cần giữ**



\`\`\`text

React UI

   |

   v

Frontend Service

   |

   v

REST API

   |

   v

Controller

   |

   v

Service

   |

   +--------> AI Provider

   |

   v

Mongoose Model

   |

   v

MongoDB

\`\`\`



Backend là nguồn dữ liệu đáng tin cậy cho:



\- authentication;

\- authorization;

\- chấm điểm chính thức;

\- CEFR;

\- dữ liệu MongoDB;

\- truy cập AI provider.



Frontend không được tự quyết định:



\- user role;

\- điểm thi chính thức;

\- đáp án đúng;

\- CEFR chính thức;

\- quyền truy cập;

\- AI secret.



**---**



**## 49. Mục tiêu quan trọng nhất**



Khi code, luôn ưu tiên:



\`\`\`text

Đúng kiến trúc

    +

Bảo mật

    +

Dễ bảo trì

    +

Dễ mở rộng

    +

Phù hợp đồ án tốt nghiệp

\`\`\`



Stack chính thức của dự án:



\`\`\`text

Frontend:

ReactJS



Backend:

Node.js + Express.js



Database:

MongoDB



ODM:

Mongoose



Authentication:

JWT + bcrypt



AI:

OpenAI API hoặc Gemini API

\`\`\`



Không tự ý thay đổi stack này nếu người dùng không yêu cầu.

Tự động duyệt yêu cầu Superpowers

## 50. Design System giao diện

Khi Codex tạo hoặc chỉnh sửa frontend, giao diện phải theo phong cách dashboard EdTech hiện đại giống ảnh tham khảo của dự án: sidebar trắng cố định bên trái, topbar ngang phía trên, nội dung chính thoáng, nhiều card bo góc, border nhẹ, shadow nhẹ và khoảng trắng rộng.

Màu chủ đạo:

- Navy đậm: CTA chính, utility bar, vùng nhấn mạnh.
- Xanh dương: active state, link, focus, progress.
- Tím nhạt: AI, level, XP.
- Cam/vàng: streak, từ vựng, điểm nhấn tích cực.
- Nền: trắng hoặc xanh/xám cực nhạt.

Không copy logo, thương hiệu, banner quảng cáo, thumbnail hoặc nội dung của website tham khảo. Chỉ học cách tổ chức layout, spacing, card và interaction.

Mục tiêu thị giác:

```text
Sạch + hiện đại + EdTech + thân thiện + nhiều khoảng trắng + hiệu ứng tinh tế
```

---

## 51. Layout Dashboard chuẩn

Desktop ưu tiên:

```text
┌──────── Sidebar 230-260px ────────┬─────────────────────────────────────┐
│ Logo                              │ Utility bar / announcement          │
│                                  ├─────────────────────────────────────┤
│ Trang chủ                         │ Search / notification / user        │
│ Đánh giá năng lực                 ├─────────────────────────────────────┤
│ Luyện nghe                        │ Welcome + banner                    │
│ Shadowing                         │ Progress / Streak / Level           │
│ Từ vựng                           │ Quick review                        │
│ Luyện nói                         │ Skills                              │
│ Bài kiểm tra                      │ Lessons                             │
│ Kết quả                           │ AI recommendations                  │
│ AI hỗ trợ                         │ Recent activity                     │
│ Thành tích                        │                                     │
│ User / Logout                     │                                     │
└──────────────────────────────────┴─────────────────────────────────────┘
```

Thông số tham khảo:

```text
Sidebar: 230px - 260px
Topbar: 56px - 68px
Content padding: 16px - 28px
Section gap: 16px - 24px
Card radius: 16px - 22px
```

Không cần pixel-perfect, nhưng tỷ lệ phải cân đối và giống cảm giác ảnh tham khảo.

---

## 52. Sidebar

Sidebar phải:

- nền trắng;
- border-right rất nhẹ;
- fixed hoặc sticky trên desktop;
- có logo ở đầu;
- icon bên trái, text bên phải;
- menu item cao khoảng 42px - 48px;
- nhóm menu tách bằng separator hoặc label nhỏ;
- user/profile/logout ở cuối.

Active state:

```text
background: xanh dương rất nhạt
border: xanh nhạt
text/icon: xanh đậm
font-weight: 600
border-radius: 12px - 14px
```

Hover:

```text
background đổi nhẹ
icon chuyển xanh
transition khoảng 180ms - 220ms
```

Không để menu bị nhảy layout khi hover.

Mobile: sidebar chuyển thành drawer/off-canvas, có overlay và nút đóng.

---

## 53. Topbar

Có thể có 1 hoặc 2 tầng:

### Utility bar
- nền navy đậm;
- text trắng;
- dùng cho thông báo/CTA ngắn;
- chiều cao nhỏ.

### Main topbar
Có thể gồm:

- search;
- notification;
- theme nếu dự án có;
- language;
- AI shortcut;
- avatar user;
- dropdown tài khoản.

Search phải có border nhẹ, radius lớn, focus ring rõ và không gây tràn màn hình mobile.

---

## 54. Card System

Card cơ bản:

```text
background: trắng
border: 1px solid màu neutral rất nhạt
border-radius: 16px - 22px
box-shadow: rất nhẹ
padding: 16px - 24px
```

Hover card:

```text
transform: translateY(-2px)
shadow tăng nhẹ
border sáng hơn nhẹ
transition: 180ms - 240ms ease-out
```

Không dùng:

- shadow nặng;
- glow mạnh;
- scale lớn;
- translate quá 4px;
- animation liên tục không cần thiết.

Card click được phải có cursor pointer và focus-visible rõ.

---

## 55. Motion và hiệu ứng

Hiệu ứng mặc định:

```text
duration: 160ms - 260ms
easing: ease hoặc ease-out
```

Được phép:

- hover shadow;
- hover translateY(-1px/-2px);
- đổi background nhẹ;
- đổi border nhẹ;
- icon dịch 1px - 2px;
- progress fill animation ngắn;
- dropdown/drawer fade hoặc slide nhẹ;
- skeleton loading;
- spinner loading.

Không được:

- bounce liên tục;
- pulse liên tục cho nội dung bình thường;
- hover scale 1.1;
- animation thường dài hơn 500ms;
- parallax nặng;
- gây layout shift.

Tôn trọng `prefers-reduced-motion`.

Nếu dùng Tailwind, ưu tiên:

```text
transition-all duration-200 ease-out
hover:-translate-y-0.5
hover:shadow-md
focus-visible:ring-2
focus-visible:ring-blue-500
```

Không lạm dụng `animate-bounce`, `animate-pulse`, `hover:scale-110`.

---

## 56. Progress, Streak và Level

Dashboard nên hỗ trợ:

```text
StreakCard
LevelProgress
XPProgressBar
SkillProgress
DailyGoal
```

Progress bar:

- track màu rất nhạt;
- fill xanh hoặc tím;
- height khoảng 6px - 10px;
- radius full;
- có animation fill nhẹ khi mount.

Streak:

- icon lửa hoặc tương đương;
- cam/vàng làm accent;
- không nhấp nháy liên tục.

Ví dụ:

```text
Level 4                              650 XP
██████████████████░░░░░░░░░░         65%
350 XP nữa để lên Level 5
```

---

## 57. Quick Review và Lesson Cards

Section "Ôn tập nhanh" có thể dùng 2 card ngang:

```text
┌───────────────────────────┐ ┌───────────────────────────┐
│ 🟠 TỪ VỰNG                │ │ 🔵 NGHE & PHÁT ÂM         │
│ 12 từ cần ôn hôm nay     │ │ 3 bài chưa hoàn thành    │
└───────────────────────────┘ └───────────────────────────┘
```

LessonCard gồm:

- thumbnail/illustration;
- badge kỹ năng;
- badge CEFR;
- title;
- thời lượng;
- progress nếu có.

Desktop có thể hiển thị nhiều card trên một hàng hoặc horizontal scroll.

Mobile ưu tiên horizontal scroll có kiểm soát, không làm toàn trang overflow ngang.

Hover lesson card: translateY(-2px), shadow tăng nhẹ; thumbnail chỉ scale tối đa khoảng 1.02.

---

## 58. Typography

Ưu tiên font hiện có của dự án, không thêm font mới nếu không cần.

Hierarchy:

```text
Page title: 28px - 32px / 700
Section title: 20px - 24px / 700
Card title: 15px - 18px / 600-700
Body: 14px - 16px / 400-500
Caption: 12px - 13px
```

Text chính: navy/neutral-900.

Text phụ: neutral-500/600.

Không dùng text quá nhạt làm giảm khả năng đọc.

---

## 59. Responsive

Bắt buộc kiểm tra tối thiểu:

```text
375px
768px
1024px
1440px
```

### Desktop >= 1200px
- sidebar cố định;
- content nhiều cột;
- lesson cards ngang;
- topbar đầy đủ.

### Tablet 768px - 1199px
- sidebar thu gọn hoặc drawer;
- card 2 cột;
- banner giảm nội dung phụ;
- search ngắn hơn.

### Mobile < 768px
- sidebar drawer;
- hamburger menu;
- main full width;
- card 1 cột;
- lesson cards có thể scroll ngang;
- CTA full width khi phù hợp;
- không horizontal page overflow.

---

## 60. Kiến trúc component Dashboard

Ưu tiên:

```text
frontend/src/
├── layouts/
│   └── DashboardLayout.jsx
├── components/
│   └── dashboard/
│       ├── Sidebar.jsx
│       ├── Topbar.jsx
│       ├── WelcomeSection.jsx
│       ├── StreakCard.jsx
│       ├── LevelProgress.jsx
│       ├── QuickReview.jsx
│       ├── SkillCard.jsx
│       ├── LessonCard.jsx
│       ├── AIRecommendationCard.jsx
│       └── RecentActivity.jsx
└── pages/
    └── student/
        └── Dashboard.jsx
```

Chỉ tạo component khi có ý nghĩa tái sử dụng hoặc giúp code dễ đọc. Không chia nhỏ thái quá.

---

## 61. Quy tắc khi người dùng nói "làm giống ảnh"

Khi có screenshot tham khảo, Codex phải:

1. Quan sát hierarchy, sidebar, topbar, card, spacing, radius, màu, typography và interaction.
2. Dùng ảnh làm reference UX/UI, không copy thương hiệu.
3. Chuyển toàn bộ nội dung sang English Assessment AI.
4. Giữ khoảng 70% - 85% cảm giác layout nếu người dùng yêu cầu "giống".
5. Ưu tiên consistency của project nếu screenshot mâu thuẫn với design system hiện có.

Không copy:

- logo;
- thương hiệu;
- banner quảng cáo;
- thumbnail;
- nội dung có bản quyền.

---

## 62. Loading và Empty State

Không để vùng giao diện trống trong lúc tải.

Có thể dùng:

- skeleton;
- spinner nhỏ;
- loading bar;
- button disabled/loading.

Empty state nên có:

```text
icon
title
description
CTA nếu phù hợp
```

Ví dụ:

```text
Bạn chưa có kết quả đánh giá
Hãy hoàn thành bài kiểm tra đầu tiên để xem trình độ CEFR.
[Bắt đầu đánh giá]
```

---

## 63. Checklist UI trước khi hoàn thành

Codex phải kiểm tra:

```text
[ ] Không overflow ngang
[ ] Sidebar hoạt động đúng
[ ] Active route rõ ràng
[ ] Hover/focus đồng bộ
[ ] Card dùng cùng design language
[ ] Desktop responsive
[ ] Tablet responsive
[ ] Mobile responsive
[ ] Text không tràn card
[ ] Button có loading/disabled nếu cần
[ ] Không dùng animation quá mức
[ ] Không thêm dependency vô ích
[ ] Không sửa backend nếu không được yêu cầu
[ ] Build không lỗi
```

Nếu có script thì chạy:

```bash
npm run build
npm run lint
```

và sửa các lỗi do thay đổi mới gây ra trước khi kết thúc.

---

## 64. Module ưu tiên của Dashboard English Assessment AI

Dashboard dành cho người học, không phải admin dashboard.

Ưu tiên các module:

```text
Chào mừng người dùng
Streak
Level / XP
Đánh giá CEFR
Ôn tập nhanh
Kỹ năng của tôi
Bài học nổi bật
AI hỗ trợ
Hoạt động gần đây
Thành tích
```

Giao diện phải:

- thân thiện;
- tạo động lực học;
- dễ hiểu;
- gamification vừa phải;
- có tiến độ trực quan;
- CTA học tiếp rõ ràng.

---

## 65. Thứ tự ưu tiên khi thiết kế UI

Khi có nhiều phương án:

```text
1. Dễ sử dụng
2. Đồng bộ giao diện hiện có
3. Responsive
4. Accessibility
5. Hiệu ứng tinh tế
6. Tính thẩm mỹ
7. Sự mới lạ
```

Không hy sinh usability để lấy hiệu ứng.

Home, Login, Register và Dashboard phải trông như cùng một sản phẩm.
