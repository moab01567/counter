import { Hono } from 'hono';
import {serve} from "@hono/node-server";
import {serveStatic} from "@hono/node-server/serve-static";
import Database from 'better-sqlite3'
const db = new Database("./data.db")

db.prepare(`CREATE TABLE IF NOT EXISTS counter (id INTEGER PRIMARY KEY, value INTEGER DEFAULT 0)`).run()

const row = db.prepare('SELECT value FROM counter WHERE id = 1').get()
if (!row) {
    db.prepare('INSERT INTO counter (id, value) VALUES (1, 0)').run()
}
interface DB{
    id:number,
    value:number
}
const app = new Hono();
app.get('/api/count', (c) => {
    const row = db.prepare('SELECT value FROM counter WHERE id = 1').get() as DB | undefined
    const count = row?.value ?? 0

    return c.json({ count })
})

app.post('/api/count', (c) => {
    db.prepare('UPDATE counter SET value = value + 1 WHERE id = 1').run()
    const updated = db.prepare('SELECT value FROM counter WHERE id = 1').get() as DB
    return c.json({ count: updated.value })
})

app.post('/api/count/reset', (c) => {
    db.prepare('UPDATE counter SET value = 0 WHERE id = 1').run()
    return c.json({ count: 0 })
})

app.use("/*", serveStatic({root:"../dist"}))

serve({
    fetch:app.fetch,
    port:3000
})
