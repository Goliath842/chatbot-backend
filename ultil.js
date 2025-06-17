import axios from 'axios';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = process.env.GEMINI_API_URL;
const callAI = async (userMessage) => {
    try {
        const geminiResponse = await axios.post(
            `${GEMINI_API_URL}:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        role: 'user',
                        parts: [
                            {
                                text: `Bạn là một trợ lý AI, thu nhận menu của người dùng, chỉnh sửa lại chính tả theo tiếng Việt và trả về JSON file, không markdown, không nói gì thêm.\n\n${userMessage}`
                            }
                        ]
                    }
                ]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        const reply = geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || 'Không có phản hồi từ Gemini.';
        return reply;

    } catch (error) {
        console.error('Gemini API Error:', error.response?.data || error.message);
        throw new Error('Lỗi khi gọi Gemini API');
    }
};

export default callAI;
