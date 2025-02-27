const express = require('express');
const app = express();
const fs = require('fs');

let noticias = [];
const port = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Leer datos desde el archivo JSON
function leerDatos() {
    try {
        const data = fs.readFileSync('noticias.json', 'utf-8');
        noticias = JSON.parse(data);
    } catch (error) {
        console.error('Error al leer el archivo noticias.json:', error.message);
    }
}

// Guardar datos en el archivo JSON
function guardarDatos() {
    fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));
}
// informacion general
app.get('/noticias', (req, res) => {
    leerDatos();
    res.json(noticias);
})

// Busqueda de noticia por id
app.get('/noticias/:id', (req, res) => {
    leerDatos();
    const id = req.params.id;
    const noticiaIndex = noticias.find(noticia => noticia.id == id);

    if (noticiaIndex) {
        res.json(noticiaIndex);
    } else {
        res.status(404).json({ mensaje: 'Noticia no encontrada' });
    }
})

app.post('/noticias', (req, res) => {
    leerDatos();
    const nuevaNoticia = {
        id: noticias.length + 1,
        ...req.body
    }
    noticias.push(nuevaNoticia);
    guardarDatos()
    res.redirect('/noticias');
});

app.delete('/noticias/:id', (req, res) => {
    leerDatos();
    const id = req.params.id;
    const noticiaIndex = noticias.filter(noticia => noticia.id == id);

    if (noticiaIndex) {
        const noticiaEliminada = noticias.splice(id + 1, 1);
        guardarDatos(noticiaEliminada);
    } else {
        res.status(404).json({ mensaje: 'Noticia no encontrada' });
    }

})


app.listen(port, () => {
    console.log(`Express esta escuchando en http://localhost:${port}`);
})