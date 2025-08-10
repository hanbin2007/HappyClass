import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { socket } from '../lib/ws';
import { Box, Button, Checkbox, Container, FormControlLabel, Grid, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';

export default function Teacher(){
  const { code } = useParams();
  const [qType, setQType] = useState<'single'|'tf'|'text'>('single');
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState(['A 选项','B 选项','C 选项','D 选项']);
  const [timer, setTimer] = useState(30);
  const [allowChange, setAllowChange] = useState(true);

  useEffect(()=>{
    socket.emit('student:join', { code, nickname: 'TEACHER', anonymous: true });
  }, [code]);

  async function publish(){
    const id = Math.random().toString(36).slice(2);
    const question = { id, code, type: qType, title, options: qType==='single'? options : undefined, timerSec: timer };
    // Demo：直接通过 WS 发布（生产应走 REST 再 WS）
    socket.emit('teacher:publish', { questionId: id }); // 协议留空，示意
    socket.emit('question:published', question); // 本地演示
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="overline">房间 {code}</Typography>
          <Typography variant="h5">发布题目</Typography>
          <TextField select label="题型" value={qType} onChange={e=>setQType(e.target.value as any)}>
            <MenuItem value="single">单选</MenuItem>
            <MenuItem value="tf">判断</MenuItem>
            <MenuItem value="text">填空</MenuItem>
          </TextField>
          <TextField label="题干" value={title} onChange={e=>setTitle(e.target.value)} />
          {qType==='single' && (
            <Grid container spacing={2}>
              {options.map((opt, i)=> (
                <Grid item xs={6} key={i}>
                  <TextField label={`选项 ${String.fromCharCode(65+i)}`} fullWidth value={opt}
                    onChange={e=>{
                      const arr = [...options]; arr[i] = e.target.value; setOptions(arr);
                    }} />
                </Grid>
              ))}
            </Grid>
          )}
          <Box>
            <TextField label="计时(秒)" type="number" value={timer} onChange={e=>setTimer(parseInt(e.target.value||'0'))} sx={{ mr: 2 }} />
            <FormControlLabel control={<Checkbox checked={allowChange} onChange={e=>setAllowChange(e.target.checked)} />} label="允许改答" />
          </Box>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={publish}>开始发布</Button>
            <Button>结束作答</Button>
            <Button variant="outlined">揭晓答案</Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}
