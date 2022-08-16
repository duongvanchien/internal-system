import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function FCTable(props: {
    headers: string[],
    tableBody: JSX.Element
}) {
    const { headers, tableBody } = props;
    return (
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {
                            headers.map((value, key) => (
                                <TableCell align="left" key={key} style={{ fontWeight: 700 }}>{value}</TableCell>
                            ))
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tableBody}
                </TableBody>
            </Table>
        </TableContainer>
    );
}