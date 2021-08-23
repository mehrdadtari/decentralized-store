import React, { Component } from "react";
import Layout from "../../components/Layout";
import Store from "../../ethereum/store";
import { Button, Card, Form, Grid, Message, Rating } from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import { Link } from "../../routes";

class CampaignShow extends Component {
  state = {
    rating: 0,
    errorMessage: "",
    loading: false,
  };

  static async getInitialProps(props) {
    const store = Store(props.query.address);
    const summary = await store.methods.getStoreSummary().call();
    /*
        summary which is the output of getSumary function from the campaign smart contract is actually 
        an object. The keys of these object are numbers starting from 0. So, we can access the outputs of
        getSummary function of the smart contract with summary[0], summary[1] and so on.
    */
    return {
      address: props.query.address,
      //Only getInitialProps has access to props.query.address. So, we have to return it too use it in render method.
      commoditiesCount: summary[0],
      manager: summary[1],
      bestSeller: summary[2],
      bestSellerQuantity: summary[3],
      storeName: summary[4],
      storeScore: summary[5],
      numStoreReviews: summary[6],
    };
  }
  /*
    getInitialProps has its own props which is different from the component's props. props of
    getInitialProps has a property called "query" which gives us access to token out of the url which we
    could access it before using routes.js
  */
  onRate = (e, { rating, maxRating }) => {
    this.setState({ rating, maxRating });
  };

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: "" }); // We update errornessage to clear previous errors

    try {
      const accounts = await web3.eth.getAccounts();
      const store = Store(this.props.address);
      await store.methods.reviewStore(this.state.rating).send({
        from: accounts[0],
        //When we use Metamask, we don't need to define "gas". Metamask do it automatically.
      });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  renderCards() {
    const {
      manager,
      commoditiesCount,
      bestSeller,
      bestSellerQuantity,
      storeName,
      storeScore,
      numStoreReviews,
    } = this.props;

    return (
      <Card.Group>
        <Card>
          <Card.Content>
            <Card.Header>{storeName}</Card.Header>
            <Card.Meta>Store Name</Card.Meta>
            <Card.Description>
              This store offers {commoditiesCount} products.
            </Card.Description>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content style={{ overflowWrap: "break-word" }}>
            <Card.Header>{manager}</Card.Header>
            <Card.Meta>Address of Manager</Card.Meta>
            <Card.Description>
              The manager created this store and can create new products.
            </Card.Description>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <Card.Header>{bestSeller}</Card.Header>
            <Card.Meta>Best Seller Product</Card.Meta>
            <Card.Description>
              This store has sold {<b>{bestSellerQuantity}</b>} {bestSeller}s.
            </Card.Description>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <Card.Header>{`${storeScore} / 5`}</Card.Header>
            <Card.Meta>Store Rating</Card.Meta>
            <Card.Description>
              This rating is calculated from {<b>{numStoreReviews}</b>} reviews.
            </Card.Description>
          </Card.Content>
        </Card>
      </Card.Group>
    );
  }

  render() {
    return (
      <Layout>
        <h3>Store Show</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>{this.renderCards()}</Grid.Column>
            <Grid.Column floated="right" width={4}>
              <Form
                size="huge"
                onSubmit={this.onSubmit}
                error={!!this.state.errorMessage}
              >
                <Form.Field>
                  <label style={{ marginBottom: 15 }}>Your Store Rating:</label>
                  <Rating
                    size="massive"
                    icon="star"
                    maxRating={5}
                    onRate={this.onRate}
                  />
                </Form.Field>

                <Message
                  error
                  header="Oops!"
                  content={this.state.errorMessage}
                />
                <Button size="large" primary loading={this.state.loading}>
                  Submit!
                </Button>
              </Form>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Link route={`/stores/${this.props.address}/products`}>
                <a>
                  <Button size="large" primary>
                    View Products
                  </Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default CampaignShow;