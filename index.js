import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = process.env.GEMINI_API_URL;
const GEMINI_API_MODEL = process.env.GEMINI_API_MODEL;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    if (!GEMINI_API_KEY) {
        console.error('GEMINI_API_KEY is not set in the environment variables.');
    } else {
        console.log('GEMINI_API_KEY is set.');
    }
});

app.post('/api/chat', async (req, res) => {

    const userMessage = req.body.message;

    try {
        const geminiResponse = await axios.post(
            `${GEMINI_API_URL}/models/${GEMINI_API_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
        {
            contents:[
                {
                    role: 'user',
                    parts: [
                        {
                            text: 'Bạn là một trợ lý AI thông minh, hãy trả lời câu hỏi của người dùng một cách tự nhiên và thân thiện. Trả lời bằng tiếng Việt và không trả lời quá dài. Nếu câu hỏi không rõ ràng, hãy yêu cầu người dùng làm rõ.',
                        }
                    ]
                },
                {
                    role: 'user',
                    parts: [
                        {
                            text: userMessage
                        }
                    ]
                }
            ]
        },
        {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const reply = geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || 'Không có phản hồi từ Gemini.';
        res.json({ reply });
    } catch (error) {
        console.error('Gemini API Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});
