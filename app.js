import express from 'express';
import { ItitalizeDatabase, dbAll, dbGet, dbRun } from './util/database.js';

const app = express();
app.use(express.json())

app.get('/wizard', async (req, res) => {
    const wizards = await dbAll("SELECT * FROM wizards");
    res.status(200).json(wizards);
});

app.get('/wizard/:id', async (req, res) => {
    const id = req.params.id;
    const wizard = await dbGet("SELECT * FROM wizards WHERE id = ?", [id]);
    if (wizard) {
        res.status(200).json(wizard);
    } else {
        res.status(404).send("Wizard not found");
    }
});

app.post('/wizard', async (req, res) => {
    const { name, magicWand, house } = req.body;
    await dbRun("INSERT INTO wizards (name, magicWand, house) VALUES (?,?,?)", [name, magicWand, house]);
    res.status(201).send("Wizard created");
});

app.put('/wizard/:id', async (req, res) => {
    const id = req.params.id;
    const { name, magicWand, house } = req.body;
    await dbRun("UPDATE wizards SET name = ?, magicWand = ?, house = ? WHERE id = ?", [name, magicWand, house, id]);
    res.status(200).send("Wizard updated");
}
);

app.delete('/wizard/:id', async (req, res) => {
    const id = req.params.id;
    await dbRun("DELETE FROM wizards WHERE id = ?", [id]);
    res.status(200).send("Wizard deleted");
});

async function StartServer() {
    await ItitalizeDatabase();
}

app.listen(3000, async () => {
    console.log('Server started on http://localhost:3000');
});

StartServer();