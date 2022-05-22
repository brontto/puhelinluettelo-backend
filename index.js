const { response } = require('express')
const express = require('express')


const app = express()
app.use(express.json())

let persons = [
    {
        "name": "Kalle Päätalo",
        "number": "666-854-17555",
        "id": 6
      },
      {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
      }
]

const generateId = () => {
    return Math.floor(Math.random()*100*persons.length)
}

app.post('/api/persons', (req, res) => {
    const body = req.body
    if(!body.name){
        return res.status(400).json({
            error: 'name missing'
        })
    }else if(!body.number){
        return res.status(400).json({
            error: 'number missing'
        })
    }else if(persons.find(person => person.name === body.name)){
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => {
        return person.id === id
    })
    if (person) {
        res.json(person)
    }else{
        res.status(404).end()
    }
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    const count = persons.length
    const time = new Date()
    res.send(`<h3> Phonebook has info for ${count} people<h3> ${time}`)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

