import { CircularProgress, Drawer, Hidden, List, ListItem, ListItemText, WithStyles, withStyles, WithTheme, Badge, Typography, Tooltip, Collapse, Theme, createStyles } from "@material-ui/core";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Round } from "../model/Round";
import { mainStyles } from "../styles/main";
import { Header } from "./Header";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import "typescript-array-extensions";
import { Link } from "react-router-dom";

const styles = (theme: Theme) => createStyles({
    ...mainStyles(theme),
    nested: {
        paddingLeft: theme.spacing(4)
    }
});

interface SidebarProps extends WithStyles<typeof styles>, WithTheme {
    isLoading: boolean;
    rounds: Round[];
    openYear?: number;
}

const SidebarComponent: FunctionComponent<SidebarProps> = (props) => {
    const { classes } = props;
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [openYear, setOpenYear] = useState<number | undefined>(props.openYear);

    useEffect(() => setOpenYear(props.openYear), [props.openYear]);

    const handleYearClick = (clickedYear: number) =>
        setOpenYear(openYear === clickedYear ? undefined : clickedYear);

    const handleDrawerToggle = () => setIsDrawerOpen(!isDrawerOpen);

    const renderOfficialRoundLink = (toggleDrawer: boolean, round: Round) => (
        <ListItem key={round.id} button className={props.classes.nested} component={Link} to={`/${round.id}`}>
            <ListItemText
                disableTypography={true}
                onClick={() => {
                    if (toggleDrawer) handleDrawerToggle();
                }}
            >
                <Typography>
                    {`${round.displayName} ${round.year}`}
                </Typography>
            </ListItemText>
        </ListItem>
    );

    const renderUnofficialRoundLink = (toggleDrawer: boolean, round: Round) => (
        <Tooltip title="Results are not official yet" placement="right" key={round.id}>
            <ListItem key={round.id} button className={props.classes.nested} component={Link} to={`/${round.id}`}>
                <ListItemText
                    disableTypography={true}
                    onClick={() => {
                        if (toggleDrawer) handleDrawerToggle();
                    }}
                >
                    <Badge variant="dot" color="secondary">
                        <Typography>
                            {`${round.displayName} ${round.year}`}
                        </Typography>
                    </Badge>
                </ListItemText>
            </ListItem>
        </Tooltip>
    );

    const renderDrawer = (toggleDrawer: boolean) => {
        const { classes, isLoading, rounds } = props;
        return (
            isLoading
                ? <CircularProgress className={classes.progress} />
                :
                <List>
                    {Array.from(rounds.groupBy(x => x.year).entries())
                        .slice()
                        .sort((a, b) => a[0]-b[0])
                        .map(x =>
                            <div key={x[0]}>
                                <ListItem button onClick={() => handleYearClick(x[0])}>
                                    <ListItemText primary={x[0]} />
                                    {openYear === x[0] ? <ExpandLess /> : <ExpandMore />}
                                </ListItem>
                                <Collapse in={openYear === x[0]} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {
                                            x[1].map((round: Round) =>
                                                round.areResultsOfficial
                                                    ? renderOfficialRoundLink(toggleDrawer, round)
                                                    : renderUnofficialRoundLink(toggleDrawer,
                                                        round)
                                            )
                                        }
                                    </List>
                                </Collapse>
                            </div>
                        )
                    }
                </List>
        );
    }

    return (
        <div>
            <Header onDrawerToggle={handleDrawerToggle} />
            <nav className={classes.drawer}>
                <Hidden smUp implementation="css">
                    <Drawer
                        className={classes.drawer}
                        variant="temporary"
                        anchor={props.theme.direction === "rtl" ? "right" : "left"}
                        open={isDrawerOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper
                        }}
                    >
                        {renderDrawer(true)}
                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        className={classes.drawer}
                        variant="permanent"
                        classes={{
                            paper: classes.drawerPaper
                        }}
                        open
                    >
                        <div className={classes.toolbar} />
                        {renderDrawer(false)}
                    </Drawer>
                </Hidden>
            </nav>
        </div>
    );
};

export const Sidebar = withStyles(styles, { withTheme: true })(SidebarComponent);
