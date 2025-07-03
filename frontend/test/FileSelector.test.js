import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import filesReducer from '../src/store/filesSlice'
import FileSelector from '../src/components/FileSelector'
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

describe('FileSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('muestra el selector con opción "All files" por defecto', () => {
    const store = createTestStore()
    renderWithProvider(<FileSelector />, { store })
    
    expect(screen.getByText('Filter by file:')).toBeInTheDocument()
    expect(screen.getByDisplayValue('All files')).toBeInTheDocument()
    expect(screen.getByText('Refresh')).toBeInTheDocument()
  })

  it('muestra spinner mientras carga la lista de archivos', () => {
    const store = createTestStore({ filesListLoading: true })
    renderWithProvider(<FileSelector />, { store })
    
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('muestra opciones de archivos cuando están disponibles', () => {
    const mockFiles = ['file1.csv', 'file2.csv', 'file3.csv']
    const store = createTestStore({ availableFiles: mockFiles })
    renderWithProvider(<FileSelector />, { store })
    
    expect(screen.getByDisplayValue('All files')).toBeInTheDocument()
    
    // Check that all files are in the select options
    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
    
    mockFiles.forEach(fileName => {
      expect(screen.getByText(fileName)).toBeInTheDocument()
    })
  })

  it('cambia el archivo seleccionado cuando se selecciona una opción', async () => {
    const mockFiles = ['file1.csv', 'file2.csv']
    mockedAxios.get.mockResolvedValue({ data: [] })
    
    const store = createTestStore({ availableFiles: mockFiles })
    renderWithProvider(<FileSelector />, { store })
    
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'file1.csv' } })
    
    await waitFor(() => {
      expect(select.value).toBe('file1.csv')
    })
  })

  it('muestra error cuando falla la carga de archivos', () => {
    const store = createTestStore({ 
      filesListError: 'Network error' 
    });

    jest.spyOn(filesSlice, 'fetchFilesList').mockImplementation(() => () => Promise.resolve())

    renderWithProvider(<FileSelector />, { store })
    
    expect(screen.getByText(/Error loading files list/)).toBeInTheDocument()
    expect(screen.getByText('Retry')).toBeInTheDocument()
  })

  it('permite hacer refresh de la lista', async () => {
    mockedAxios.get.mockResolvedValue({ data: ['test.csv'] })
  
    const store = createTestStore()
    renderWithProvider(<FileSelector />, { store })
  
    const refreshButton = await screen.findByText('Refresh');
  
    expect(refreshButton).not.toBeDisabled()
  
    fireEvent.click(refreshButton)
  
    await waitFor(() => {
      expect(mockedAxios.get.mock.calls.length).toBeGreaterThan(0)
    })
  })

  it('deshabilita el selector y botón refresh mientras carga', () => {
    const store = createTestStore({ 
      availableFiles: ['test.csv'],
      filesListLoading: true 
    })
    renderWithProvider(<FileSelector />, { store })
    
    const select = screen.getByRole('combobox')
    const refreshButton = screen.getByText('Refresh')
    
    expect(select).toBeDisabled()
    expect(refreshButton).toBeDisabled()
  })
}) 