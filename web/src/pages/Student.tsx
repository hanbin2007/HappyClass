import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { socket } from '../lib/ws';
import { Box, Button, Container, Grid, Paper, Stack, Typography } from '@mui/material';

export default function Student(){
  const { code } = useParams();
  const [sp] = useSearchParams();
  const [question, setQuestion] = useState<any>(null);
  const [submitted, setSubmitted] = useState<any>(null);

  useEffect(()=>{
    socket.emit('student:join', { code, nickname: sp.get('name') || '匿名', anonymous: !sp.get('name') });
    socket.on('question:published', setQuestion);
    return ()=>{
      socket.off('question:published', setQuestion);
    }
  }, [code]);

  function answer(payload: any){
    if(!question) return;
    socket.emit('student:answer', { questionId: question.id, payload });
    setSubmitted(payload);
  }

  const optionButtons = useMemo(()=>{
    if(!question) return null;
    if(question.type === 'single'){
      return (
        <Grid container spacing={2}>
          {question.options.map((opt:string, idx:number)=> (
            <Grid item xs={6} key={idx}>
              <Button fullWidth size="large" variant={submitted===idx? 'contained':'outlined'} sx={{ py: 4 }} onClick={()=>answer(idx)}>
                <Stack>
                  <Typography variant="h4">{String.fromCharCode(65+idx)}</Typography>
                  <Typography>{opt}</Typography>
                </Stack>
              </Button>
            </Grid>
          ))}
        </Grid>
      );
    }
    if(question.type === 'tf'){
      return (
        <Grid container spacing={2}>
          <Grid item xs={6}><Button fullWidth size="large" sx={{ py: 4 }} variant={submitted===true?'contained':'outlined'} onClick={()=>answer(true)}>对</Button></Grid>
          <Grid item xs={6}><Button fullWidth size="large" sx={{ py: 4 }} variant={submitted===false?'contained':'outlined'} onClick={()=>answer(false)}>错</Button></Grid>
        </Grid>
      );
    }
    return <Typography>请在发布后输入文本答案（v1 省略）。</Typography>
  }, [question, submitted]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="overline">房间 {code}</Typography>
          <Typography variant="h6">{question ? question.title : '等待教师发布题目…'}</Typography>
          <Box>{optionButtons}</Box>
          {submitted!==null && <Typography color="secondary">已提交</Typography>}
        </Stack>
      </Paper>
    </Container>
  );
}
