import React from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    Box,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const ConfirmDialog = ({ open, title, message, onConfirm, onClose }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="xs"
            fullScreen={fullScreen}
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    p: 2
                }
            }}
        >
            <Box display="flex" alignItems="center" gap={2} px={2} pt={2}>
                <InfoIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Typography variant="h6" fontWeight="bold">
                    {title}
                </Typography>
            </Box>

            <DialogContent>
                <DialogContentText sx={{ fontSize: '1rem' }}>
                    {message}
                </DialogContentText>
            </DialogContent>

            <DialogActions
                sx={{
                    display: 'flex',
                    flexDirection: fullScreen ? 'column' : 'row',
                    gap: 1,
                    px: 3,
                    pb: 2
                }}
            >
                <Button
                    onClick={onClose}
                    variant="outlined"
                    color="primary"
                    fullWidth={fullScreen}
                >
                    Anuluj
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color="primary"
                    fullWidth={fullScreen}
                >
                    Potwierdź
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;