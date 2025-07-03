import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import filesReducer from '../src/store/filesSlice'
import FilesTable from '../src/components/FilesTable'
import axios from 'axios'
import * as filesSlice from '../src/store/filesSlice'

// Mock axios
jest.mock('axios')
const mockedAxios = axios

// Crear un store de prueba
const createTestStore = (customState = {}) => {
  return configureStore({
    reducer: {
      files: filesReducer,
    },
    preloadedState: {
      files: {
        data: [],
        availableFiles: [],
        selectedFile: '',
        loading: false,
        error: null,
        filesListLoading: false,
        filesListError: null,
        ...customState
      }
    }
  })
}

const renderWithProvider = (ui, { store = createTestStore() } = {}) => {
  return render(<Provider store={store}>{ui}</Provider>)
}

describe('FilesTable', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('muestra mensaje si no hay datos', async () => {
    mockedAxios.get.mockResolvedValue({ data: [] })
    
    const store = createTestStore()
    renderWithProvider(<FilesTable />, { store })
    
    await waitFor(() => {
      expect(screen.getByText('No data available')).toBeInTheDocument()
    })
  })

  it('muestra mensaje específico cuando un archivo está seleccionado pero no hay datos', async () => {
    mockedAxios.get.mockResolvedValue({ data: [] })
    
    const store = createTestStore({ 
      selectedFile: 'test.csv',
      data: []
    })
    renderWithProvider(<FilesTable />, { store })
    
    await waitFor(() => {
      expect(screen.getByText('No data available for file: test.csv')).toBeInTheDocument()
    })
  })

  it('muestra una fila si hay datos', async () => {
    const mockData = [{
      file: 'test.csv',
      lines: [{ text: 'Hola', number: 123, hex: 'abc123' }]
    }]
    
    mockedAxios.get.mockResolvedValue({ data: mockData })
    
    const store = createTestStore({ data: mockData })
    renderWithProvider(<FilesTable />, { store })
    
    await waitFor(() => {
      expect(screen.getByText('test.csv')).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.getByText('Hola')).toBeInTheDocument()
    })
  })

  it('muestra varias filas si hay más datos', async () => {
   const mockData = [
     {
       file: 'file1.csv',
       lines: [
         { text: 'Línea 1', number: 111, hex: 'aaa' },
         { text: 'Línea 2', number: 222, hex: 'bbb' }
       ]
     }
   ]
 
   mockedAxios.get.mockResolvedValue({ data: mockData })
 
   const store = createTestStore({ data: mockData })
   renderWithProvider(<FilesTable />, { store })
 
   await waitFor(() => {
     expect(screen.getByText('Línea 1')).toBeInTheDocument()
     expect(screen.getByText('Línea 2')).toBeInTheDocument()
   })
  })

  it('muestra mensaje de error si falla el fetch', async () => {
   mockedAxios.get.mockRejectedValue(new Error('Network error'))
 
   const store = createTestStore({ error: 'Some network error' })
   renderWithProvider(<FilesTable />, { store })
 
   await waitFor(() => {
     expect(screen.getByText(/Network error/i)).toBeInTheDocument()
   })
  })

  it('muestra spinner mientras carga', () => {
   const store = createTestStore({ loading: true  })
   renderWithProvider(<FilesTable />, { store })
 
   expect(screen.getByRole('status')).toBeInTheDocument()
   expect(screen.getByText(/Loading data/i)).toBeInTheDocument()
 })

 it('muestra el título correcto cuando hay un archivo seleccionado', () => {
   const mockData = [{
     file: 'selected.csv',
     lines: [{ text: 'Test', number: 123, hex: 'abc123' }]
   }]
 
   const store = createTestStore({ 
     selectedFile: 'selected.csv',
     data: mockData 
   })
   renderWithProvider(<FilesTable />, { store })
 
   expect(screen.getByText('Data from: selected.csv')).toBeInTheDocument()
 })

 it('muestra el título correcto cuando no hay archivo seleccionado', () => {
   const mockData = [
     { file: 'file1.csv', lines: [{ text: 'Test1', number: 123, hex: 'abc123' }] },
     { file: 'file2.csv', lines: [{ text: 'Test2', number: 456, hex: 'def456' }] }
   ]
 
   const store = createTestStore({ 
     selectedFile: '',
     data: mockData 
   })

   jest.spyOn(filesSlice, 'fetchFilesData').mockImplementation(() => () => Promise.resolve())

   renderWithProvider(<FilesTable />, { store })
 
   expect(screen.getByText('All Files Data (2 files)')).toBeInTheDocument()
 })
})
