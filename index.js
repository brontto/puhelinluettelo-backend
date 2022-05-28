require('dotenv').config()
const Person = require('./models/person')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.static('build'))
app.use(express.json())



morgan.token('post', function (req, res) {
    if(req.method === 'POST'){
        return JSON.stringify(req.body)
    }
})

app.use(morgan(':method :url :status :res[content-length] :response-time ms :post'))


app.post('/api/persons', (req, res, next) => {
    const body = req.body
    

    const person = new Person ({
        name: body.name,
        number: body.number,
    })

    person.save().then(savePerson => {
        res.json(savePerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
    
    const person = {
        name: body.name,
        number: body.number
    }
    Person.findByIdAndUpdate(req.params.id, person, {new: true})
        .then(updatePerson => {
            res.json(updatePerson)
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res) => {
    console.log(req.params.id)
    Person.findByIdAndRemove(req.params.id)
        .then(result =>{
            res.status(204).end()
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
    const person = Person.findById(req.params.id)
        .then(note => {
            res.json(note)
        })
        .catch(error => next(error))
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.get('/info', (req, res) => {
    Person.find({}).then(persons => {
        const time = new Date()
        res.send(`<h3> Phonebook has info for ${persons.length} people<h3> ${time}`)
    })
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError'){
        return res.status(400).json({error: error.message})
    }

    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

