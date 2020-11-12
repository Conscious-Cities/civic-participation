import React, { useState, useEffect, useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

import { ConsumeAuth } from "../../hooks/authContext";
import { ConsumeVote } from "../../hooks/voteContext";

import { ProposalCategory, ProposalType } from "../../types/civic";
import { toLabel as categoryToLabel } from "../../types/proposals/categories";
import { toLabel as typeToLabel } from "../../types/proposals/type";
import ProposalStatus, { toDefinition } from "../../types/proposals/status";

import CategoryItem from "./components/CategoryItem";
import LocationGoogleMaps from "../../components/Location/LocationGoogleMaps";
import { HtmlTooltip } from '../../components/Themes';
import Navbar from "../../components/Navbar/Navbar";
import Timeline from "./components/Timeline";

import settings from "../../settings";

import background from "../../assets/image/header.png";

import {
  Grid,
  Typography,
  Radio,
  TextField,
  Button,
  RadioGroup,
  Link,
  CircularProgress
} from "@material-ui/core";

import { DropzoneArea } from "material-ui-dropzone";
import { Lock } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { Stars, ExpandMore, ExpandLess } from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import ButtonBase from "@material-ui/core/ButtonBase";
import CurrencyTextField from "@unicef/material-ui-currency-textfield";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";

import "./ProposalDetail.scss";
import "./ProposalEdit.scss";

function parseLocation(location) {
  return {
    lat: parseFloat(location.split(",")[0]),
    lng: parseFloat(location.split(",")[1]),
  };
}

const CHARACTER_LIMIT = 1000;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  input: {
    "&::placeholder": {
      color: "#599C6D",
      fontSize: 14,
      opacity: 1,
    },
    textAlign: "left",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  inputLabel: {
    color: "#599C6D",
    "&.Mui-focused": {
      color: "#599C6D",
    },
  },
  categoryTitle: {
    paddingTop: "10px",
  },
  margin: {
    margin: theme.spacing(5),
  },
  commonText: {
    marginLeft: "20px",
    "& .MuiInputBase-input": {
      paddingBottom: "5px",
    },
    "& label.Mui-focused": {
      color: "#000000",
      fontSize: "18px",
    },
    "& .MuiInputBase-root.MuiInput-underline:after": {
      borderBottomColor: "#000000",
    },
    "& .MuiInput-underline:before": {
      borderBottom: "none",
    },
    "& label + .MuiInput-formControl": {
      marginTop: "10px",
    },
    "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
      borderBottom: "none",
    },
    "& .makeStyles-inputLabel-118": {
      color: "#000000",
      fontSize: "25px",
    },
  },
  inputTitle: {
    color: "#000000",
    width: "425px",
    fontSize: "25px",
    disableUnderline: true,
  },
  inputLabelTitle: {
    color: "#000000",
    fontSize: "25px",
  },
  image: {
    width: '100%',
    height: '100%',
  },
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
  },
  paper: {
    margin: "auto",
    maxWidth: 330,
    marginRight: 25,
  },
  currencyInput: {
    width: "80%",
  },
  inputTitleEdit: {
    color: "#000000",
    width: "425px",
    fontSize: "25px",
    disableUnderline: true,
  },
}));

const CategoryRadio = withStyles({
  root: {
    color: "#599C6D",
    fontSize: "14px",
    "&$checked": {
      color: "#599C6D",
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

const HeaderCustomizeStar = withStyles({
  root: {
    color: "#000000",
    width: "28px",
    height: "28px",
  },
})(Stars);

const TitleLock = withStyles({
  root: {
      fontSize: "14px"
  }
})(Lock);


const GreenSmallTypographyCreate = withStyles({
  root: {
      fontSize: '15px',
      color: '#1261A3',
  }
})(Typography);

const CreateLock = withStyles({
  root: {
      color: '#1261A3'
  }
})(Lock);

const AddToVoteButton = withStyles({
  root: {
    backgroundColor: "#1261A3",
    borderRadius: 3,
    border: 0,
    color: "white",
    height: 36,
    padding: "0 20px",
    marginLeft: "10px",
  },
  label: {
    textTransform: "capitalize",
    fontSize: "14px",
    fontWeight: "500",
  },
})(Button);

const StatusTypography = withStyles({
  root: {
    fontSize: "12px",
    color: "rgba(89, 156, 109, 1)",
    lineHeight: "14.06px",
    fontWeight: "400",
  },
})(Typography);

const MainTitleTypography = withStyles({
  root: {
    fontSize: '20px',
    color: 'rgba(18, 97, 163, 1)',
    lineHeight: '26.6px',
    fontWeight: '600'
  }
})(Typography);

const MainSmallTitleTyography = withStyles({
  root: {
    fontSize: '15px',
    color: 'rgba(18, 97, 163, 1)',
    lineHeight: '26.6px',
    fontWeight: '400'
  }
})(Typography);

const TitleLabelTypography = withStyles({
  root: {
    fontSize: "12px",
    color: "rgba(89, 156, 109, 1)",
    lineHeight: "14.06x",
    fontWeight: "400",
  },
})(Typography);

const CollapseTyography = withStyles({
  root: {
    fontSize: "12px",
    color: "rgba(18, 97, 163, 1)",
    lineHeight: "16px",
    fontWeight: "400",
  },
})(Typography);

const TitleCategoryTypography = withStyles({
  root: {
    color: "#599C6D",
    fontWeight: 500,
    fontSize: "15px",
  },
})(Typography);

const GovernmentTitleTypography = withStyles({
  root: {
    fontSize: "12px",
    color: "rgba(89, 156, 109, 1)",
    lineHeight: "16x",
    fontWeight: "400",
  },
})(Typography);

const UploadButton = withStyles({
  root: {
    backgroundColor: "#1261A3",
    borderRadius: 3,
    border: 0,
    color: "white",
    height: 36,
    padding: "0 20px",
    marginLeft: "10px",
  },
  label: {
    textTransform: "capitalize",
    fontSize: "14px",
    fontWeight: "500",
  },
})(Button);

const UploadSmallTypographyCreate = withStyles({
  root: {
    fontSize: "15px",
    color: "#1261A3",
  },
})(Typography);

const UploadLock = withStyles({
  root: {
    color: "#1261A3",
  },
})(Lock);

const TimelineLock = withStyles({
  root: {
    color: 'rgba(18, 97, 163, 1);',
    width: '25px',
  }
})(Lock);

export default function ProposalDetail() {
  const { proposal_id } = useParams();
  const history = useHistory();

  const authContext = ConsumeAuth();
  const voteContext = ConsumeVote();

  const classes = useStyles();

  const [showHistory, setShowHistory] = useState(true);
  const [category, setCategory] = useState(null);
  const [files, setFiles] = useState([]);
  const [fileSizeError, setFileSizeError] = useState(false);
  const [location, setLocation] = useState({ lat: 52.1135031, lng: 4.2829047 });
  const [editing, setEditing] = useState(false);
  const [proposal, setProposal] = useState();
  const [proposalHistory, setProposalHistory] = useState();
  const [historyCollapse, setHistoryCollapse] = useState('COLLAPSE');
  const [currencyValue, setCurrencyValue] = useState();
  const [loading, setLoading] = useState(false);


  const [placeholder, setPlaceholder] = useState(`
      Please provide a clear description of the infrastructure change.
      Clearly describe how this proposal will impact the neighborhood.
      Explain who will this change have a positive and negative impact on.
  `);

  const [showButtons, setShowButtons] = useState({
    vote: false,
    edit: false,
  });

  const {
    errors,
    handleSubmit,
    watch,
    register,
    setValue,
    clearErrors,
    control,
  } = useForm({
    criteriaMode: "all",
  });

  const handleChangeBudget = (budget) => {
    setCurrencyValue(budget)
  }

  const handleFileSize = (message) => {
    if (message.search("File is too big") > 0) {
      setFileSizeError(true);
      return;
    }
    setFileSizeError(false);
  };

  const currencyFormatter = new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  });

  const getProposal = useCallback(async () => {
    const proposalRes = await authContext.civic.proposalGet(proposal_id);
    const proposalState = {
      proposalId: proposalRes.proposalId,
      title: proposalRes.title,
      description: proposalRes.description,
      budget: proposalRes.budget,
      category: proposalRes.category,
      type: proposalRes.type,
      location: parseLocation(proposalRes.location),
      status: proposalRes.status,
    };
    if (proposalRes.photo) proposalState.photo = proposalRes.photo;
    if (proposalRes.regulations)
      proposalState.regulations = proposalRes.regulations;
    if (proposalRes.comment) proposalState.comment = proposalRes.comment;

    if (authContext.isGov) {
      setShowButtons({
        vote: false,
        edit: true,
      });
    } else {
      if (proposalRes.status === ProposalStatus.Approved) {
        setShowButtons({
          vote: true,
          edit: false,
        });
      }
    }

    setLocation(proposalState.location);
    setProposal(proposalState);
  }, [authContext.civic, authContext.isGov, proposal_id]);

  const navigateSecurityPage = () => {
    window.open("https://conscious-cities.com/security", "_blank")
  }

  const getProposalHistory = useCallback(async () => {
    const historyRes = await authContext.civic.proposalHistory(proposal_id);
    const historyState = [];
    for (let historyItem of historyRes) {
      const txUrl = `${settings.eosio.blockExplorerUrl}/tx/${historyItem.txId}`;

      let status;
      switch (historyItem.action) {
        case 'propcreate':
          status = ProposalStatus.Proposed;
          break;
        case 'propupdate':
        case 'propupdate2':
          status = historyItem.data.new_status;
          break;
        case 'propvote':
          status = -99;
          break;
        default:
          throw new Error("action logic not implemented yet")
      }

      historyState.push({
        txUrl: txUrl,
        name: historyItem.authHumanCommonName,
        gov: historyItem.gov,
        comment: historyItem.comment,
        timestamp: historyItem.timestamp.toLocaleDateString("nl-NL"),
        status: status !== -99 ? toDefinition(status) : 'Voted',
      });
    }
    setProposalHistory(historyState);
  }, [authContext.civic, proposal_id]);

  useEffect(() => {
    async function main() {
      if (!(await authContext.isLoggedIn())) {
        history.push("/login");
        return;
      }
      getProposal();
      getProposalHistory();
    }
    main();
  }, [authContext, history, getProposal, getProposalHistory]);

  const handleCollapse = () => {
    setShowHistory(!showHistory);
    showHistory ? setHistoryCollapse('EXPAND') : setHistoryCollapse('COLLAPSE');
  };

  function onVote() {
    voteContext.setProposals([ ...voteContext.proposals, proposal ]);
    history.push("/vote");
  }

  const handleChangeLocation = async (location) => {
    setLocation(location);
  };

  const onSubmit = async (data) => {
    const budget =
      typeof data.budget === "string"
        ? parseFloat(data.budget.replace(",", ""))
        : data.budget;

    await authContext.civic.proposalUpdate({
      ...data,
      proposalId: proposal.proposalId,
      budget,
      category: +data.category,
      status: +data.status,
      type: +data.type,
      location: `${location.lat},${location.lng}`,
      photo: files.length > 0 ? files[0] : undefined,
    });

    getProposal();
    getProposalHistory();
    setEditing(false);
  };

  const handleDropDownImage = (files) => {
    setFiles(files);
  };

  return (
    <div className={classes.root}>
      <Navbar />
      {proposal && !editing && (
        <Grid container direction="column">
          <Grid className="header-wraper-proposal">
            <img src={background} className="header-img" alt="Dutch canals" />

          </Grid>
          <div className="main-container-proposal">
            <Grid
              container
              direction="row"
              className="header-title"
              alignItems="center"
            >
              <HeaderCustomizeStar />
              <TextField
                className={classes.margin + " " + classes.commonText}
                InputProps={{
                  className: classes.inputTitle,
                }}
                InputLabelProps={{
                  className: classes.inputLabelTitle,
                }}
                value={proposal.title}
                editable="false"
              />
            </Grid>
            <Grid container>
              <Grid item xs={12} container>
                <Grid item xs={4} container spacing={1} direction="column">
                  <Grid item>
                    <StatusTypography>Status</StatusTypography>
                  </Grid>
                  <Grid item>
                    <MainTitleTypography>
                      {toDefinition(proposal.status)}
                    </MainTitleTypography>
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={8}
                  container
                  spacing={2}
                  alignItems="center"
                  justify="flex-end"
                  className="button-wraper"
                >
                  {showButtons.vote && (
                    <Grid item>
                      <AddToVoteButton type="button" onClick={onVote}>
                        ADD TO VOTE
                      </AddToVoteButton>
                    </Grid>
                  )}
                  {showButtons.edit && (
                    <Grid item>
                      <AddToVoteButton
                        type="button"
                        onClick={() => setEditing(true)}
                      >
                        EDIT
                      </AddToVoteButton>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} container className="item-wraper">
              <Grid item xs={4} container direction="column">
                {proposal.budget && (
                  <Grid item>
                    <TitleLabelTypography>Budget</TitleLabelTypography>
                    {currencyFormatter.format(proposal.budget)}
                  </Grid>
                )}
                <Grid item className="type-wrape">
                  <TitleLabelTypography>
                    Infrastructure type
                  </TitleLabelTypography>
                  {typeToLabel(proposal.type)}
                </Grid>
                <Grid
                  item
                  container
                  className="category-wraper"
                  direction="column"
                  spacing={2}
                >
                  <Grid item>
                    <TitleLabelTypography>Category</TitleLabelTypography>
                  </Grid>
                  <Grid item container spacing={2}>
                    <Grid item xs={6} container spacing={2} alignItems="center">
                      <CategoryItem
                        title={categoryToLabel(proposal.category)}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={8}>
                <Paper className={classes.paper}>
                  <ButtonBase className={classes.image}>
                    <img
                      className={classes.img}
                      alt={proposal.title}
                      src={proposal.photo}
                    />
                  </ButtonBase>
                </Paper>
              </Grid>
            </Grid>
            <Grid item xs={12} container className="description-wraper">
              <Grid item xs={11}>
                <TitleLabelTypography>Description</TitleLabelTypography>
                {proposal.description}
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <div className="googlmap-wrape">
                <LocationGoogleMaps location={proposal.location} zoom={15} />
              </div>
            </Grid>
            <Grid item xs={12} container className="government-wraper">
              <Grid item>
                {proposal.comment && proposal.regulations && (
                  <MainTitleTypography>
                    Government additions
                  </MainTitleTypography>
                )}
              </Grid>
              <Grid item container spacing={7}>
                {proposal.regulations && (
                  <Grid
                    item
                    xs={4}
                    container
                    direction="column"
                    spacing={2}
                    className="regulations-wraper"
                  >
                    <Grid item>
                      <TitleLabelTypography>Regulations</TitleLabelTypography>
                    </Grid>
                    <Grid item>{proposal.regulations}</Grid>
                  </Grid>
                )}
                {proposal.comment && (
                  <Grid
                    item
                    xs={6}
                    container
                    direction="column"
                    spacing={2}
                    className="comment-wraper"
                  >
                    <Grid item>
                      <TitleLabelTypography>
                        Comment for latest update
                      </TitleLabelTypography>
                    </Grid>
                    <Grid item>{proposal.comment}</Grid>
                  </Grid>
                )}
              </Grid>
            </Grid>
            <Grid item xs={12} container className="history-wraper">
              <Grid item container alignItems="center" justify="space-between">
                <Grid item xs container spacing={8} alignItems="center">
                  <Grid item>
                    <MainTitleTypography>History</MainTitleTypography>
                  </Grid>
                  <HtmlTooltip
                    title={
                      <React.Fragment>
                        <div>Proposals, voting and government actions
                        are stored on the blockchain. Historic data is cryptographically secure,
                        meaning the history of events cannot be changed by anyone, including the
                        government.
                            <Link className="read-more-link" onClick={navigateSecurityPage}>
                            Click to learn more
                            </Link>
                        </div>
                      </React.Fragment>
                    }
                    arrow
                    interactive
                  >
                    <span>
                      <Grid item container>
                        <TimelineLock />
                        <MainSmallTitleTyography>Immutable</MainSmallTitleTyography>
                      </Grid>
                    </span>
                  </HtmlTooltip>
                </Grid>
                <Grid item container xs className="collapse-wraper" alignItems="center" justify="flex-end" onClick={handleCollapse}>
                  <CollapseTyography>{historyCollapse}</CollapseTyography>
                  {showHistory ? <ExpandLess /> : <ExpandMore />}
                </Grid>
              </Grid>
              <Grid className="timeline-box-wraper">
                {showHistory &&
                  proposalHistory &&
                  proposalHistory.map((data, key) => {
                    return (
                      <Grid item container direction="column" key={key}>
                        <Timeline
                          actionType={data.status}
                          userName={data.name}
                          comment={data.comment}
                          status={data.status}
                          time={data.timestamp}
                          exploreUrl={data.txUrl}
                          gov={data.gov}
                        />
                      </Grid>
                    );
                  })}
              </Grid>
            </Grid>
          </div>
        </Grid>
      )}

      {proposal && editing && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container direction="column">
            <Grid className="header-wraper">
              <img src={background} className="header-img" />
            </Grid>
            <div className="main-container-proposal-edit">
              <Grid container alignItems="center">
                <Grid
                  item
                  container
                  direction="row"
                  className="header-title"
                  alignItems="center"
                  xs={8}
                >
                  <HeaderCustomizeStar />
                  <TextField
                    label="Name your idea"
                    className={classes.margin + " " + classes.commonText}
                    InputProps={{
                      className: classes.inputTitleEdit,
                    }}
                    InputLabelProps={{
                      className: classes.inputLabelTitle,
                    }}
                    defaultValue={proposal.title}
                    name="title"
                    inputRef={register({
                      required: "Please enter a title",
                    })}
                    error={errors.title !== undefined}
                  />
                  {errors.title && (
                    <FormHelperText>Please select a title.</FormHelperText>
                  )}
                </Grid>
                <Grid item xs={4} container className="upload-button">
                  <Grid item>
                    <HtmlTooltip
                      title={
                      <React.Fragment>
                        <div>{<TitleLock />}Proposals, voting and government actions are stored on the blockchain.
                            This data is cryptographically secured and cannot be forged or tampered
                            with by anyone, including the government.&nbsp;
                          <Link className="read-more-link" onClick={navigateSecurityPage}>
                              Click to learn more
                          </Link>
                        </div>
                      </React.Fragment>
                      }
                      arrow
                      interactive
                    >
                      <Grid item container className="tamper-wraper">
                        <Grid item>
                          <GreenSmallTypographyCreate>
                            tamper proof
                        </GreenSmallTypographyCreate>
                        </Grid>
                        <Grid item>
                            <CreateLock />
                        </Grid>
                      </Grid>
                    </HtmlTooltip>
                  </Grid>
                  <Grid item>
                      <UploadButton type="button"  disabled={loading}>SAVE</UploadButton>
                      {loading && <CircularProgress size={24} className="button-progress" />}
                  </Grid>
                  <Grid item>
                      <UploadButton type="button"  onClick={() => window.location.reload()}>CANCEL</UploadButton>
                      {loading && <CircularProgress size={24} className="button-progress" />}
                  </Grid>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12} container>
                  <Grid item xs={4} container spacing={1} direction="column">
                    <Grid item>
                      <MainTitleTypography>Edit User input</MainTitleTypography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} container className="item-wraper">
                <Grid item xs={6} container alignItems="center" spacing={3}>
                  <Grid item>
                    <CurrencyTextField
                      name="budget"
                      defaultValue={proposal.budget}
                      currencySymbol="€"
                      outputFormat="string"
                      decimalCharacter="."
                      digitGroupSeparator=","
                      placeholder="Budget"
                      InputProps={{
                        classes: {
                          input: classes.input,
                        },
                      }}
                      className={classes.budgetInputStyle}
                      className={classes.budgetInputStyle}
                      error={errors.budget !== undefined}
                      control={control}
                      ref={register}
                      key="budget"
                      rules={{ required: true }}
                      value={currencyValue}
                      onChange={(event, value) => handleChangeBudget(value)}
                    />
                  </Grid>
                  <Grid item className="type-wrape">
                    <FormControl className={classes.formControl}>
                      <InputLabel
                        htmlFor="type-select"
                        className={classes.inputLabel}
                      >
                        Type
                      </InputLabel>
                      <Select
                        native
                        inputProps={{
                          name: "type",
                          id: "type-select",
                        }}
                        errors={errors}
                        name="type"
                        inputRef={register({
                          required: "Please enter a name",
                        })}
                        defaultValue={proposal.type}
                      >
                        <option value={ProposalType.Create}>New</option>
                        <option value={ProposalType.Update}>Upgrade</option>
                        <option value={ProposalType.Remove}>Remove</option>
                      </Select>
                      {errors.type && (
                        <FormHelperText>Please select a type.</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item sm container className="category-checkbox-wrap">
                    <Controller
                      defaultValue={proposal.category.toString()}
                      render={(props) => (
                        <RadioGroup {...props} aria-label="category">
                          {" "}
                          <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={6} container direction="column">
                              <FormControlLabel
                                control={<CategoryRadio />}
                                label="Green space"
                                value={ProposalCategory.Green}
                                defaultChecked={true}
                              />
                              <FormControlLabel
                                control={<CategoryRadio />}
                                label="Kids"
                                value={ProposalCategory.Kids}
                                defaultChecked={true}
                              />
                              <FormControlLabel
                                control={<CategoryRadio />}
                                value={ProposalCategory.Safety}
                                label="Safety"
                                defaultChecked={false}
                              />
                              <FormControlLabel
                                control={<CategoryRadio />}
                                value={ProposalCategory.Accessibility}
                                label="Accessibility"
                                defaultChecked={false}
                              />
                            </Grid>
                            <Grid item xs={6} container direction="column">
                              <FormControlLabel
                                control={<CategoryRadio />}
                                value={ProposalCategory.Art}
                                label="Art"
                                defaultChecked={false}
                              />
                              <FormControlLabel
                                control={<CategoryRadio />}
                                value={ProposalCategory.Health}
                                label="Health"
                                defaultChecked={false}
                              />
                              <FormControlLabel
                                control={<CategoryRadio />}
                                value={ProposalCategory.Road}
                                label="Roads"
                                defaultChecked={false}
                              />
                              <FormControlLabel
                                control={<CategoryRadio />}
                                value={ProposalCategory.Residential}
                                label="Residential"
                                defaultChecked={false}
                              />
                            </Grid>
                          </Grid>
                        </RadioGroup>
                      )}
                      rules={{ required: true }}
                      name="category"
                      control={control}
                    />

                    <Grid
                      item
                      xs={12}
                      className="checkbox-helper"
                      container
                      justify="flex-start"
                    >
                      {errors.category !== undefined && (
                        <FormHelperText>
                          Please select a category.
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item container xs={6} justify="flex-end">
                  <DropzoneArea
                    acceptedFiles={["image/*"]}
                    dropzoneText="drag files here or click to upload"
                    onChange={(files) => handleDropDownImage(files)}
                    filesLimit={1}
                    showAlerts={false}
                    maxFileSize={2000000}
                    onAlert={(message) => handleFileSize(message)}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} container className="description-wraper">
                <Grid item xs={11}>
                  <TextField
                    label="Description"
                    inputProps={{
                      maxLength: CHARACTER_LIMIT,
                    }}
                    margin="normal"
                    multiline
                    fullWidth
                    name="description"
                    inputRef={register({
                      required: "Please enter a description",
                    })}
                    helperText={`(${watch("description")?.length || 0
                      }/${CHARACTER_LIMIT})`}
                    className="description-textarea"
                    error={errors.description !== undefined}
                    placeholder={placeholder}
                    value={proposal.description}
                  />
                </Grid>
                <Grid item xs={12} className="description-helper">
                  {errors.description && (
                    <FormHelperText>
                      Description must be at min 100 to 1000 characters.{" "}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <div className="googlmap-wrape">
                  <LocationGoogleMaps
                    location={proposal.location}
                    zoom={15}
                    handleChange={handleChangeLocation}
                  />
                </div>
              </Grid>
              <Grid
                item
                xs={12}
                container
                className="government-wraper"
                alignItems="center"
              >
                <Grid item container>
                  <Grid item xs={4}>
                    <MainTitleTypography>
                      Government additions
                    </MainTitleTypography>
                  </Grid>
                  <Grid item xs={6} className="status-wrape">
                    <FormControl className={classes.formControl}>
                      <InputLabel
                        htmlFor="status-select"
                        className={classes.inputLabel}
                      >
                        Status
                      </InputLabel>
                      <Select
                        native
                        inputProps={{
                          name: "status",
                          id: "status-select",
                        }}
                        errors={errors}
                        name="status"
                        inputRef={register({
                          required: "Please enter a name",
                        })}
                      >
                        <option aria-label="status" />
                        <option value={ProposalStatus.Reviewing}>
                          Reviewing
                        </option>
                        <option value={ProposalStatus.Approved}>
                          Approved
                        </option>
                        <option value={ProposalStatus.Rejected}>
                          Rejected
                        </option>
                      </Select>
                      {errors.status && (
                        <FormHelperText>Please select a status.</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid item container spacing={7}>
                  <Grid
                    item
                    xs={4}
                    container
                    direction="column"
                    spacing={2}
                    className="regulations-wraper"
                  >
                    <Grid item>
                      <GovernmentTitleTypography>
                        Regulations
                      </GovernmentTitleTypography>
                    </Grid>
                    <Grid item>
                      <TextField
                        margin="normal"
                        multiline
                        rows={5}
                        fullWidth
                        name="regulations"
                        inputRef={register()}
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    container
                    direction="column"
                    spacing={2}
                    className="comment-wraper"
                  >
                    <Grid item>
                      <GovernmentTitleTypography>
                        Comment for latest update
                      </GovernmentTitleTypography>
                    </Grid>
                    <Grid item>
                      <TextField
                        margin="normal"
                        multiline
                        rows={5}
                        fullWidth
                        name="comment"
                        inputRef={register({
                          required: "Please enter a comment",
                        })}
                      />
                    </Grid>
                    <Grid item xs={12} className="description-helper">
                      {errors.comment && (
                        <FormHelperText>Please insert value</FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
             
            </div>
          </Grid>
        </form>
      )}
    </div>
  );
}
