import React from 'react';
import ListItem from "@material-ui/core/ListItem";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";


class SessionCardView extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {  }
    componentWillUnmount() {  }

    render() {

        return (
            <ListItem>
                <Card variant="outlined">
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {this.props.session.forSorting.format("dddd DD/MM/YYYY")}
                        </Typography>
                        <Typography variant="subtitle2">
                            {`${this.props.session.forSorting.format('DD/MM/YYYY HH:mm')} - ${this.props.session.endTime}`}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {`Number Of slots: ${this.props.session.duration}`}
                        </Typography>
                    </CardContent>
                    {this.props.shouldHideControls && <CardActions>
                        <Button size="small" color="primary" onClick={()=>this.props.deleteSession(this.props.index,1,this.props.session.duration)}>
                            Delete
                        </Button>
                        <Button size="small" color="primary" onClick={()=>this.props.openToEdit(1,this.props.index)}>
                            Edit
                        </Button>
                    </CardActions>}
                </Card>
            </ListItem>
        );

    }
}

export default SessionCardView;
