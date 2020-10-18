import React from 'react'
import { Grid, Typography, Button, Paper, ButtonBase } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    mainContainer: {
        marginTop: 30
    },
    cardWrap: {
        maxWidth: 800,
        margin: 'auto'
    },
    paper: {
        padding: 10,
        margin: 'auto',
        maxWidth: 285,
        marginBottom: 30,
        height: 300
    },
    image: {
        width: 283,
        height: 185
    },
    img: {
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%'
    },
    cardContent: {
        padding: 10
    },
    cardTitle: {
        minHeight: 50
    }
}))

const CardTitle = withStyles({
    root: {
        color: '#000000',
        fontWeight: 'normal',
        fontSize: '18px',
        lineHeight: '21px',
        '&:hover': {
            cursor: 'pointer'
        },
        marginTop: 10
    }
})(Typography);

const CardContentDescription = withStyles({
    root: {
        color: '#000000',
        fontWeight: 'normal',
        fontSize: '10px',
        lineHeight: '24px',
        marginTop: 10
    }
})(Typography);

const ReadmoreButton = withStyles({
    root: {
        backgroundColor: '#1261A3',
        borderRadius: 3,
        border: 0,
        color: 'white',
        height: 36,
        maxWidth: 96,
        '&:hover': {
            backgroundColor: '#1261A3'
        }
    },
    label: {
        textTransform: 'capitalize',
        fontSize: '12px',
        fontWeight: 'normal'
    },
})(Button);

export default function Card(props) {
    const classes = useStyles();

    return (
        <>
            <Paper className={classes.paper}>
                <Grid container direction="column">
                    <Grid item>
                        <ButtonBase className={classes.image}>
                            <img className={classes.img} alt="card" src="" />
                        </ButtonBase>
                    </Grid>
                    <Grid item container className={classes.cardContent} direction="column">
                        <Grid item container className={classes.cardTitle}>
                            <Grid item xs>
                                <CardTitle onClick={props.onClick}>{(props.title).slice(0, 30)}</CardTitle>
                            </Grid>
                            <ReadmoreButton>READ MORE</ReadmoreButton>
                        </Grid>
                        <Grid item>
                            <CardContentDescription>
                                {(props.description).slice(0, 70)} ...
                            </CardContentDescription>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </>
    );
}