import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { socket } from '../lib/ws';
import { Container, Paper, Stack, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Screen(){
  const { code } = useParams();
  const [question, setQuestion] = useState<any>(null);
  const [stats, setStats] = useState<any>({ counts: [] });

  useEffect(()=>{
    socket.emit('student:join', { code, nickname: 'SCREEN', anonymous: true });
    socket.on('question:published', setQuestion);
    socket.on('stats:update', setStats);
    return ()=>{
      socket.off('question:published', setQuestion);
      socket.off('stats:update', setStats);
    }
  }, [code]);

  const data = (question?.options||[]).map((o:string, i:number)=> ({ name: String.fromCharCode(65+i), value: stats.counts?.[i] || 0 }));

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="overline">房间 {code}</Typography>
          <Typography variant="h4">{question ? question.title : '等待教师发布题目…'}</Typography>
          {question && question.type==='single' && (
            <div style={{ width: '100%', height: 360 }}>
              <ResponsiveContainer>
                <BarChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          {/* 判断/填空图表可按需求扩展 */}
        </Stack>
      </Paper>
    </Container>
  );
}
