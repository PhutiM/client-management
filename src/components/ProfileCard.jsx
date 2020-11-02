import React, { useState, useEffect } from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { Grid, Typography, TextField } from '@material-ui/core'
import LoadingError from "./LoadingError"
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import MuiTableCell from "@material-ui/core/TableCell"
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'
import Button from '@material-ui/core/Button'
import * as Action from '../actions/ProfileActions'
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { useHistory } from "react-router-dom"

const TableCell = withStyles({
    root: {
        borderBottom: "none"
    }
})(MuiTableCell)

const useStyles = makeStyles((theme) => ({
    card: {
        width: "500px",
        margin: "5px",
        border: '2px solid #00123d'
    },
    imageGrid: {
        borderRadius: '100%',
        border: "2px solid #520141"
    },
    profilePicture: {
        float: 'left',
        borderRadius: '100%',
        margin: "10px",
        border: "2px solid #520141"
    },
    button: {
        marginTop: 40,
    },
    cover: {
        width: 151,
    },
    select: {
        width: '250px',
        margin: '20px',
        display: 'inline-block'
    },
    sortBy: {
        width: '60px',
        margin: '5px',
        display: 'inline-block'
    },
    topBar: {
        position: 'sticky',
        top: 0,
        bottom: 20,
        width: '100%',
        backgroundColor: '#f9f9f9'

    },
    container: {
        maxHeight: 900,
        left: "30%"
    },
    selectField: {
        margin: '5px',
        width: '500px',
        [theme.breakpoints.down('sm')]: {
            width: '100%'
        }
    },
}))

export const ProfileCard = (props) => {
    const { profiles, profileActions } = props
    const classes = useStyles()

    const [rowsPerPage, setRowsPerPage] = useState(50)
    const [order, setOrder] = useState('asc')
    const [orderBy, setOrderBy] = useState('first')
    const [page, setPage] = useState(0)
    const [isSearchEnabled, setSearch] = useState(false)
    const [mounted, setMounted] = useState(true)
    const [profileData, setProfiles] = useState([])


    const handleSearch = event => {

        let filteredDatas = []
        let nameSearch = event.target.value
        if (nameSearch === "") {
            setSearch(false)
        } else {
            setSearch(true)
        }

        filteredDatas = profiles.filter(profile =>
            profile.name.first.toLowerCase().includes(nameSearch.toLowerCase()) ||
            profile.name.last.toLowerCase().includes(nameSearch.toLowerCase()) ||
            profile.location.city.toLowerCase().includes(nameSearch.toLowerCase())
        )

        setProfiles(filteredDatas)
    }

    useEffect(() => {
        if (mounted && profiles.length > 1) {
            setProfiles(profiles)
            setMounted(false)
        }
    }, [mounted, profiles])


    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index])
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0])
            if (order !== 0) return order
            return a[1] - b[1]
        });
        return stabilizedThis.map((el) => el[0])
    }

    function getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, profileData.length - page * rowsPerPage);

    const history = useHistory()

    const goToDetails = (profile) => {
        profileActions.getProfileInfo(profile)
        history.push('/profileDetails')
    }

    return (
        <Grid>
            <TableContainer className={classes.container}>
                <Grid className={classes.topBar}>
                    <TextField
                        className={classes.selectField}
                        label={'Search'}
                        type="search"
                        theme={{
                            container: classes.container
                        }}
                        onChange={(event) => handleSearch(event)}
                    />
                </Grid>


                {profileData.length > 0 ?
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={'small'}
                        aria-label="enhanced table"
                    > <TableBody>
                            {stableSort(profileData, getComparator(order, orderBy))
                                .map((profile, index) => {
                                    return (
                                        <TableRow style={{ border: "0px transparent" }}>
                                            <TableCell>
                                                <Card key={index} className={classes.card}>
                                                    <Grid className={classes.imageGrid}>
                                                        <img className={classes.profilePicture} width={150} al={""} src={profile.picture.large} />
                                                    </Grid>
                                                    <CardContent className={classes.content}>
                                                        <Typography variant="h6">
                                                            Name: {profile.name.first}
                                                        </Typography>
                                                        <Typography>
                                                            Surname: {profile.name.last}
                                                        </Typography>
                                                        <Typography>
                                                            {console.log(profile)}
                                                            Date of Birth: {profile.dob.date}
                                                        </Typography>
                                                        <Button
                                                            variant="contained"
                                                            color="secondary"
                                                            className={classes.button}
                                                            onClick={() => goToDetails(profile)}
                                                        >
                                                            See More
                                                     </Button>
                                                    </CardContent>
                                                </Card>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 33 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table> : <LoadingError />}
            </TableContainer>
        </Grid>
    )
}


const mapDispatchToProps = dispatch => {
    return {
        profileActions: bindActionCreators(Action, dispatch)
    }
}

export default connect(null, mapDispatchToProps)(ProfileCard)

