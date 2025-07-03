import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { config } from '../config';

export const fetchFilesList = createAsyncThunk(
  'files/fetchFilesList',
  async () => {
    const res = await axios.get(`${config.BACKEND_ENDPOINT}/files/list`);
    return res.data;
  }
);

export const fetchFilesData = createAsyncThunk(
  'files/fetchFilesData',
  async (fileName) => {
    const url = fileName 
      ? `${config.BACKEND_ENDPOINT}/files/data?fileName=${encodeURIComponent(fileName)}`
      : `${config.BACKEND_ENDPOINT}/files/data`;
    const res = await axios.get(url);
    return res.data;
  }
);

const filesSlice = createSlice({
  name: 'files',
  initialState: {
    data: [],
    availableFiles: [],
    selectedFile: '',
    loading: false,
    error: null,
    filesListLoading: false,
    filesListError: null,
  },
  reducers: {
    setSelectedFile: (state, action) => {
      state.selectedFile = action.payload;
    },
    clearError: (state) => {
      state.error = null;
      state.filesListError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch files data
      .addCase(fetchFilesData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilesData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchFilesData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch files list
      .addCase(fetchFilesList.pending, (state) => {
        state.filesListLoading = true;
        state.filesListError = null;
      })
      .addCase(fetchFilesList.fulfilled, (state, action) => {
        state.filesListLoading = false;
        state.availableFiles = action.payload;
      })
      .addCase(fetchFilesList.rejected, (state, action) => {
        state.filesListLoading = false;
        state.filesListError = action.error.message;
      });
  },
});

export const { setSelectedFile, clearError } = filesSlice.actions;
export default filesSlice.reducer;
