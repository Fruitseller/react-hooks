// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {fetchPokemon, PokemonDataView, PokemonForm, PokemonInfoFallback} from '../pokemon'


class PokemonErrorBoundary extends React.Component {
  state = {
    hasError: false,
    errorMessage: '',
  }

  static getDerivedStateFromError(error) {
    return {hasError: true, errorMessage: error.message}
  }

  componentDidCatch(error, errorInfo) {
    console.log(`error: ${error} `)
  }

  render() {
    if (this.state.hasError) {
      return <div role='alert'>
        There was an error: <pre style={{whiteSpace: 'normal'}}>{this.state.errorMessage}</pre>
      </div>
    }
    return this.props.children
  }
}

function PokemonInfo({pokemonName}) {
  const [pokemon, setPokemon] = React.useState()
  const [status, setStatus] = React.useState('idle')
  const [error, setError] = React.useState()

  React.useEffect(() => {
    if (pokemonName) {
      setStatus('pending')
      fetchPokemon(pokemonName).then(result => {
        setPokemon(result)
        setStatus('resolved')
      }).catch(error => {
        setError(error)
        setStatus('rejected')
      })
    }
  }, [pokemonName])
  // 🐨 Have state for the pokemon (null)
  // 🐨 use React.useEffect where the callback should be called whenever the
  // pokemon name changes.
  // 💰 DON'T FORGET THE DEPENDENCIES ARRAY!
  // 💰 if the pokemonName is falsy (an empty string) then don't bother making the request (exit early).
  // 🐨 before calling `fetchPokemon`, make sure to update the loading state
  // 💰 Use the `fetchPokemon` function to fetch a pokemon by its name:
  //   fetchPokemon('Pikachu').then(
  //     pokemonData => { /* update all the state here */},
  //   )
  // 🐨 return the following things based on the `pokemon` state and `pokemonName` prop:
  //   1. no pokemonName: 'Submit a pokemon'
  //   2. pokemonName but no pokemon: <PokemonInfoFallback name={pokemonName} />
  //   3. pokemon: <PokemonDataView pokemon={pokemon} />

  switch (status) {
    case 'idle': {
      return 'Submit a pokemon'
    }
    case 'pending': {
      return <PokemonInfoFallback name={pokemonName} />
    }
    case 'resolved': {
      return <PokemonDataView pokemon={pokemon} />
    }
    case 'rejected': {
      throw error
    }
    default: {
      return 'Submit a pokemon'
    }
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className='pokemon-info-app'>
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className='pokemon-info'>
        <PokemonErrorBoundary>
          <PokemonInfo pokemonName={pokemonName} />
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

export default App
