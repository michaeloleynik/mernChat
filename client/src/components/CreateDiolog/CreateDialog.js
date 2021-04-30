import React, { useState } from 'react';
import { useHttp } from '../../hooks/useHttp';
import { Toast } from '../Toast/Toast';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputAdornment from '@material-ui/core/InputAdornment';

export const CreateDialog = ({fetchItems, open, closeHandler, myId}) => {
  const {request} = useHttp();

  const [form, setForm] = useState({partnerLogin: '', currentMessage: '', authorId: myId});
  const [listOpen, setListOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [status, setStatus] = useState('');

  const changeHandler = async e => {  
    setForm({ ...form, [e.target.name]: e.target.value });
    if(e.target.name === 'partnerLogin' && e.target.value !== '') {
      // console.log(e.target.value);
      const data = await request(`/api/dialog/getFilteredUsers?query=${e.target.value}`);
      // console.log(data.out);
      setOptions(data.out.map(o => o.individualLogin.split('@')[1]));
    } else if (e.target.name === 'partnerLogin' && e.target.value === '') {
      setOptions([]);
    }     
  }


  
  const createHandler = async () => {
    try {
      const data = await request('/api/dialog/createDialog', 'POST', { ...form });
      if (data.status === 201) {
        fetchItems();
        closeHandler();
      } else {
        setStatus({msg: data.message, codeStatus: data.status, key: Math.floor(Math.random() * 10000)});
      }

      
    } catch (e) {
      throw e;
    }
  }

  return (
    <div>
      {status && 
        <Toast message={status.msg} codeStatus={status.codeStatus} key={status.key} />
      }

      <Dialog maxWidth="xl" open={open} onClose={closeHandler} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create a dialog</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create new dialog, please put partner's individual login.
          </DialogContentText>
          <Autocomplete
            id="autocompleteAsyncSearch"
            open={listOpen}
            onInputChange={changeHandler}
            onOpen={() => {
              setListOpen(true);
            }}
            onClose={() => {
              setListOpen(false);
            }}
            onSelect={changeHandler}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => option}
            options={options}
            renderInput={(params) => (
              <TextField
                {...params}
                id="partnerLogin"
                autoFocus
                margin="dense"
                name="partnerLogin"
                label="Individual partner's login"
                type="text"
                variant="outlined"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  startAdornment: <InputAdornment position="end">@</InputAdornment>
                }}
              />
            )}
          />
          <TextField
            id="message"
            margin="dense"
            name="currentMessage"
            label="Message"
            type="text"
            multiline
            rows={6}
            rowsMax={16}
            variant="outlined"
            fullWidth
            onChange={changeHandler}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeHandler} color="primary">
            Cancel
          </Button>
          <Button onClick={createHandler} color="primary" disabled={form.currentMessage === ''}>
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

