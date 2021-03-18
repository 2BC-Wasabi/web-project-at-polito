import React from "react";
import IconButton from "@material-ui/core/IconButton";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";

class ListControls extends React.Component {
    constructor(props) {
        super(props);

        this.state = {selectedScore:10}
        //states here
        this.handleChange = this.handleChange.bind(this)
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }
    handleChange = (value) => {
        this.setState({selectedScore: value});

    }
    render() {
        if (this.props.mode === 0) {
            return (
                <>
                    <IconButton edge="end" aria-label="Present" onClick={()=>{this.props.actionFunction(13)}}>
                        <CheckIcon/>
                    </IconButton>
                    <IconButton edge="end" aria-label="Absent" onClick={()=>{this.props.actionFunction(12)}}>
                        <CloseIcon/>
                    </IconButton>
                </>
            );
        }
        else if (this.props.mode === 1) {
            //todo other scores 12 absent 13 present
            return (
                <>
                    <FormControl>
                        <Select
                            labelId="demo-simple-select-required-label"
                            id="demo-simple-select-required"
                            value={this.state.selectedScore}
                            onChange={(event => this.handleChange(event.target.value))}>
                            <MenuItem value={10}>Fail</MenuItem>
                            <MenuItem value={11}>Withdraw</MenuItem>
                            <MenuItem value={18}>18</MenuItem>
                            <MenuItem value={19}>19</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                            <MenuItem value={21}>21</MenuItem>
                            <MenuItem value={22}>22</MenuItem>
                            <MenuItem value={23}>23</MenuItem>
                            <MenuItem value={24}>24</MenuItem>
                            <MenuItem value={25}>25</MenuItem>
                            <MenuItem value={26}>26</MenuItem>
                            <MenuItem value={27}>27</MenuItem>
                            <MenuItem value={28}>28</MenuItem>
                            <MenuItem value={29}>29</MenuItem>
                            <MenuItem value={30}>30</MenuItem>
                            <MenuItem value={31}>30 e lode</MenuItem>

                        </Select>
                    </FormControl>
                    <IconButton edge="end" aria-label="Confirm" onClick={()=>{this.props.actionFunction(this.state.selectedScore)}}>
                        <CheckIcon />
                    </IconButton>
                </>
            );
        }else if (this.props.mode === 2) {
            return (
                <>
                    <Typography>{`Score: ${this.props.data === 10? 'Fail':this.props.data === 11 ? 'Withdraw':this.props.data === 12 ?'Absent':this.props.data === 31 ? '30L':this.props.data}`}</Typography>
                </>
            );
        }else if (this.props.mode === 3) {
            return this.props.isTeacher? false:(<>
                <IconButton style={{alignSelf:'center'}} edge="end" aria-label="Book" onClick={()=>{this.props.actionFunction(8005)}}>
                    <CheckIcon/>
                </IconButton>
            </>);
        } else if (this.props.mode === 4) {
            return (false);
        }

    }
}

export default ListControls;


/*
          <ListItemSecondaryAction>
              <FormControl>
            <Select
              labelId="demo-simple-select-required-label"
              id="demo-simple-select-required"
              value={10}  >
              <MenuItem value="">
              </MenuItem>
              <MenuItem value={18}>18</MenuItem>
              <MenuItem value={19}>19</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={21}>21</MenuItem>
              <MenuItem value={22}>22</MenuItem>
              <MenuItem value={23}>23</MenuItem>
              <MenuItem value={24}>24</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={26}>26</MenuItem>
              <MenuItem value={27}>27</MenuItem>
              <MenuItem value={28}>28</MenuItem>
              <MenuItem value={29}>29</MenuItem>
              <MenuItem value={30}>30</MenuItem>
              <MenuItem value={31}>30 cum laude</MenuItem>
            </Select>
          </FormControl>
          <IconButton edge="end" aria-label="Present">
                  <CheckIcon />
            </IconButton>
          </ListItemSecondaryAction>


             <Typography>12</Typography>
 */