import { Container, TextField, Button, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Join(){
  const nav = useNavigate();
  const [code, setCode] = useState('');
  const [name, setName] = useState('');

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Stack spacing={2}>
          <Typography variant="h5">加入课堂互动</Typography>
          <TextField label="房间码" value={code} onChange={e=>setCode(e.target.value.toUpperCase())} inputProps={{ maxLength: 6 }} />
          <TextField label="昵称(可选)" value={name} onChange={e=>setName(e.target.value)} />
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={()=>nav(`/student/${code}?name=${encodeURIComponent(name)}`)}>我是学生</Button>
            <Button variant="outlined" onClick={()=>nav(`/teacher/${code}`)}>我是老师</Button>
            <Button onClick={()=>nav(`/screen/${code}`)}>大屏端</Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}
