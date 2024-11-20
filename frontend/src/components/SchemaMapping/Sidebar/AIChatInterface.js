import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  IconButton, 
  Typography, 
  Paper,
  CircularProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const ChatMessage = ({ message }) => (
  <Paper 
    sx={{ 
      p: 1, 
      mb: 1, 
      maxWidth: '80%',
      ml: message.type === 'assistant' ? 0 : 'auto',
      bgcolor: message.type === 'assistant' ? 'grey.100' : 'primary.light',
      color: message.type === 'assistant' ? 'text.primary' : 'primary.contrastText'
    }}
  >
    <Typography variant="body2">{message.content}</Typography>
  </Paper>
);

const AIChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { type: 'user', content: input }]);
    setInput('');

    try {
      // API call to AI service would go here
      const response = await new Promise(resolve => 
        setTimeout(() => resolve({ 
          response: "I've analyzed the correlation between those columns..." 
        }), 1000)
      );

      setMessages(prev => [...prev, { 
        type: 'assistant', 
        content: response.response 
      }]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      p: 2 
    }}>
      <Typography variant="h6" gutterBottom>
        AI Assistant
      </Typography>
      
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto', 
        mb: 2,
        display: 'flex',
        flexDirection: 'column-reverse'
      }}>
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg} />
        ))}
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your data..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <IconButton 
          onClick={handleSend} 
          disabled={isLoading || !input.trim()}
          color="primary"
        >
          {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
        </IconButton>
      </Box>
    </Box>
  );
};

export default AIChatInterface;
