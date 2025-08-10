import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

const app = express();
app.use(cors());
app.use(express.json());

// in-memory stores (v1 简化)
const rooms = new Map<string, { code: string; students: Set<string>; currentQ?: any }>();
const questions = new Map<string, any>();
const aggregates = new Map<string, any>();

// REST 示例：创建房间
app.post('/api/rooms', (_req, res) => {
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  rooms.set(code, { code, students: new Set() });
  res.json({ code });
});

// REST 示例：发布题目（写入并通过 WS 推送）
app.post('/api/questions/:id/publish', (req, res) => {
  const q = questions.get(req.params.id);
  if (!q) return res.status(404).end();
  io.to(`room:${q.code}`).emit('question:published', q);
  rooms.get(q.code)!.currentQ = q;
  aggregates.set(q.id, { total: 0, counts: Array(q.options?.length || 0).fill(0), tf: { true: 0, false: 0 }, text: new Map<string, number>() });
  res.json({ ok: true });
});

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.of('/room').on('connection', (socket) => {
  socket.on('student:join', ({ code, nickname, anonymous }, ack) => {
    socket.join(`room:${code}`);
    rooms.get(code)?.students.add(socket.id);
    ack?.({ studentId: socket.id });
  });

  socket.on('student:answer', ({ questionId, payload }) => {
    const agg = aggregates.get(questionId);
    if (!agg) return;
    agg.total++;
    if (typeof payload === 'number') agg.counts[payload]++;
    else if (typeof payload === 'boolean') agg.tf[payload ? 'true' : 'false']++;
    else if (typeof payload === 'string') agg.text.set(payload, (agg.text.get(payload) || 0) + 1);
    io.to([...socket.rooms].filter(r => r.startsWith('room:'))).emit('stats:update', serializeAgg(questionId));
  });
});

function serializeAgg(id: string) {
  const a = aggregates.get(id);
  return {
    questionId: id,
    total: a?.total || 0,
    counts: a?.counts || [],
    tfCounts: a?.tf || { true: 0, false: 0 },
    textTop: a?.text ? [...a.text.entries()].sort((x, y) => y[1] - x[1]).slice(0, 50) : []
  };
}

if (process.env.NODE_ENV !== 'test') {
  server.listen(5174, () => console.log('Server on http://localhost:5174'));
}

export { app, server };
