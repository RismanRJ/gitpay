import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import {
  withStyles,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Container,
} from '@material-ui/core'
import { AccountBalanceWallet, Work, Apps, Assignment, GroupWork } from '@material-ui/icons'
import { injectIntl, FormattedMessage } from 'react-intl'
import TopBarContainer from '../../../../../../containers/topbar'
import Bottom from 'design-library/organisms/layouts/bottom-bar/bottom'
import messages from './messages'
import mainStyles from '../../../../../../styleguide/styles/style'
const freelancerImage = require('images//collections/collection-flat-community.svg')
const companiesImage = require('images//collections/collection-flat-companies.svg')
const teamImage = require('images//welcome-teamwork.png')

import {
  MainTitle,
  MainList,
  ResponsiveImage,
  Section
} from '../components/CommonStyles'

const styles = theme => mainStyles(theme)

const Welcome = (props) => {
  const ref = useRef(null)
  const [value, setValue] = React.useState(0)

  React.useEffect(() => {
    // componentDidMount() equivalent
  }, [])

  React.useEffect(() => {
    // componentWillUnmount() equivalent
    return () => {
      // Clean up code
    }
  }, [])

  const { classes } = props

  return (
    <div className={ classes.root }>
      <TopBarContainer hide />
      <Container>
        <Section name='contrib' ref={ ref }>
          <Grid container spacing={ 3 }>
            <Grid item xs={ 12 } sm={ 6 }>
              <MainTitle left>
                <Typography variant='h5' gutterBottom>
                  <FormattedMessage
                    id='welcome.headline.forfreelancers'
                    defaultMessage='For contributors and freelancers'
                  />
                </Typography>
              </MainTitle>
              <MainList>
                <List>
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon style={ { marginRight: 12 } }>
                      <Avatar className={ classes.iconFill }>
                        <Apps />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={ props.intl.formatMessage(
                        messages.welcomeFreelancersItemOnePrimary
                      ) }
                      secondary={ props.intl.formatMessage(
                        messages.welcomeFreelancersItemOneSecondary
                      ) }
                    />
                  </ListItem>

                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon style={ { marginRight: 12 } }>
                      <Avatar className={ classes.iconFill }>
                        <Work />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={ props.intl.formatMessage(
                        messages.welcomeFreelancersItemTwoPrimary
                      ) }
                      secondary={ props.intl.formatMessage(
                        messages.welcomeFreelancersItemTwoSecondary
                      ) }
                    />
                  </ListItem>

                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon style={ { marginRight: 12 } }>
                      <Avatar className={ classes.iconFill }>
                        <AccountBalanceWallet />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={ props.intl.formatMessage(
                        messages.welcomeFreelancersItemThreePrimary
                      ) }
                      secondary={ props.intl.formatMessage(
                        messages.welcomeFreelancersItemThreeSecondary
                      ) }
                    />
                  </ListItem>
                </List>
              </MainList>
            </Grid>
            <Grid item xs={ 12 } sm={ 6 }>
              <ResponsiveImage width='800' src={ freelancerImage } />
            </Grid>
          </Grid>
        </Section>
      </Container>
      <Section name='companies' ref={ ref } alternative className={ classes.bgContrast }>
        <Container>
          <Grid container spacing={ 3 }>
            <Grid item xs={ 12 } sm={ 6 }>
              <MainTitle left>
                <Typography variant='h5' gutterBottom>
                  <FormattedMessage
                    id='welcome.tagline.companies.main.headline'
                    defaultMessage='For maintainers and organizations'
                  />
                </Typography>
              </MainTitle>
              <MainList>
                <List>
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon style={ { marginRight: 12 } }>
                      <Avatar className={ classes.iconFill }>
                        <Assignment />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={ props.intl.formatMessage(
                        messages.welcomeCompaniesItemOnePrimary
                      ) }
                      secondary={ props.intl.formatMessage(
                        messages.welcomeCompaniesItemOneSecondary
                      ) }
                    />
                  </ListItem>
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon style={ { marginRight: 12 } }>
                      <Avatar className={ classes.iconFill }>
                        <GroupWork />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={ props.intl.formatMessage(
                        messages.welcomeCompaniesItemTwoPrimary
                      ) }
                      secondary={ props.intl.formatMessage(
                        messages.welcomeCompaniesItemTwoSecondary
                      ) }
                    />
                  </ListItem>
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon style={ { marginRight: 12 } }>
                      <Avatar className={ classes.iconFill }>
                        <AccountBalanceWallet />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={ props.intl.formatMessage(
                        messages.welcomeCompaniesItemThreePrimary
                      ) }
                      secondary={ props.intl.formatMessage(
                        messages.welcomeCompaniesItemThreeSecondary
                      ) }
                    />
                  </ListItem>
                </List>
              </MainList>
            </Grid>
            <Grid item xs={ 12 } sm={ 6 }>
              <ResponsiveImage width='600' src={ companiesImage } />
            </Grid>
          </Grid>
        </Container>
      </Section>
      <Container>
        <Section name='collab' ref={ ref }>
          <Grid container spacing={ 3 }>
            <Grid item xs={ 12 } sm={ 6 }>
              <MainTitle left>
                <Typography variant='h5' gutterBottom>
                  <FormattedMessage
                    id='welcome.headline.collab'
                    defaultMessage='Working in development communities'
                  />
                </Typography>
              </MainTitle>
              <MainList>
                <List>
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon style={ { marginRight: 12 } }>
                      <Avatar className={ classes.iconFill }>
                        <Apps />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={ props.intl.formatMessage(
                        messages.welcomeCollabItemOnePrimary
                      ) }
                      secondary={ props.intl.formatMessage(
                        messages.welcomeCollabItemOneSecondary
                      ) }
                    />
                  </ListItem>
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon style={ { marginRight: 12 } }>
                      <Avatar className={ classes.iconFill }>
                        <Work />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={ props.intl.formatMessage(
                        messages.welcomeCollabItemTwoPrimary
                      ) }
                      secondary={ props.intl.formatMessage(
                        messages.welcomeCollabItemTwoSecondary
                      ) }
                    />
                  </ListItem>
                  <ListItem className={ classes.listIconTop }>
                    <ListItemIcon style={ { marginRight: 12 } }>
                      <Avatar className={ classes.iconFill }>
                        <AccountBalanceWallet />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={ props.intl.formatMessage(
                        messages.welcomeCollabItemThreePrimary
                      ) }
                      secondary={ props.intl.formatMessage(
                        messages.welcomeCollabItemThreeSecondary
                      ) }
                    />
                  </ListItem>
                </List>
              </MainList>
            </Grid>
            <Grid item xs={ 12 } sm={ 6 }>
              <ResponsiveImage width='600' src={ teamImage } />
            </Grid>
          </Grid>
        </Section>
      </Container>
      <Bottom />
    </div>
  )
}

Welcome.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default injectIntl(withStyles(styles)(Welcome))
