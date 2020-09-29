#include <eosio/eosio.hpp>

using namespace std;
using namespace eosio;

CONTRACT civic : public contract
{
public:
  using contract::contract;

  // microseconds vote_period = eosio::days(30);
  // static constexpr uint32_t vote_yes_pass_count = 5; // 5 yes votes

  ACTION propcreate(name creator, string title, string description, uint8_t category, float budget, uint8_t type, string location);

  ACTION propupdate(name updater, uint64_t proposal_id, string title, string description, uint8_t category, float budget, uint8_t type, string location, uint8_t new_status, string regulations, string comment);

  // ACTION propvote(name voter, uint64_t proposal_id, bool vote);

  // Updates votes passed the voting period that have not passed to status = Rejected

  // ACTION propupdfailed(name authorizer);

  // Default actions
  // ACTION hi(name from, string message);
  // ACTION clear();

  ACTION clear();

private:
  enum ProposalCategory
  {
    Green,
    Kids,
    Road
  };

  enum ProposalType
  {
    Create,
    Remove,
    Update
  };

  enum ProposalStatus
  {
    Proposed,
    Reviewing,
    Approved,
    Rejected,
    VotePassed,
    VoteFailed,
    Actioned,
    Closed
  };

  TABLE proposal
  {
    // primary key automatically added by EOSIO method
    uint64_t proposal_id;
    string title;
    string description;
    uint8_t category;
    float budget;
    // Since the enums are not accepted in eosio we are using uint8_t
    uint8_t type;
    // vector<string> photos;
    // Since the enums are not accepted in eosio we are using uint8_t
    uint8_t status;
    string regulations;
    string location;
    // automatically added by EOSIO method
    time_point created;
    time_point approved;
    time_point updated;
    // vector<eosio::name> voted;
    // uint8_t yes_vote_count;

    auto primary_key() const
    {
      return proposal_id;
    }
  };

  typedef multi_index<name("proposals"), proposal> proposals_table;

  // Default table
  // TABLE messages {
  //   name    user;
  //   string  text;
  //   auto primary_key() const { return user.value; }
  // };
  // typedef multi_index<name("messages"), messages> messages_table;
};