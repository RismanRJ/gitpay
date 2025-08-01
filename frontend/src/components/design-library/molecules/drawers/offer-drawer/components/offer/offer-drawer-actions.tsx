import React from 'react';
import { FormattedMessage } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(2)
  },
  button: {
    margin: theme.spacing(1)
  }
}));

const OfferDrawerActions = ({ priceConfirmed, termsAgreed, onClose }) => {
  const classes = useStyles();

  return (
    <div style={{display: 'flex', justifyContent: 'flex-end', margin: 10}}>
      <Button onClick={onClose} color="primary" style={{marginRight: 10}}>
        <FormattedMessage id="general.actions.cancel" defaultMessage="Cancel" />
      </Button>
      <Button variant="contained" color="primary" disabled={priceConfirmed || termsAgreed}>
        <FormattedMessage id="issues.bounties.actions.work" defaultMessage="Create Offer" />
      </Button>
    </div>
  );
};

export default OfferDrawerActions;