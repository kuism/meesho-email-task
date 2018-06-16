const requestPromise = require("request-promise");

const DB = require("../configs/database");
const MS = require("../configs/config").MicroServices;

const WITHA = "WITH-A";
const WITHOUTA = "WITHOUT-A";
const sendEmailTypes = [WITHA, WITHOUTA];

const processEmailForItem =  async (itemId, itemType, attachment) => {
    if (itemType === "order") {
        let response;
        if (!attachment){
            const url = `${MS.invoiceService}invoices/${itemType}/${itemId}`;
            response = await requestPromise(url);
            response = JSON.parse(response).invoice;
        } else {
            response = attachment;
        }
        return createEmailHistoryAndSendMail(itemId, itemType, response);
    } else {
        return Promise.reject(new Error("Item type not valid"))
    }
};

const createEmailHistoryAndSendMail = async (itemId, itemType, attachment) => {
  let history = await DB.emailHistories.findOne({item_id: itemId, item_type: itemType});
  // this is to avoid processing the queue if email was already send by invoice MS
  if (history && (history.send_email_types.indexOf(WITHA) > -1)){
      return {email_history: history}
  }

  const data = getFormattedDataForEmail(itemId, itemType, attachment);
  if (data) {
      const response = await sendEmail(data, attachment);
      if (!response.success) {
          return {email_history: null}
      }

      const sendingType = attachment ? sendEmailTypes[0] : sendEmailTypes[1];

      if (history) {
          DB.emailHistories.update({_id: history._id}, {$addToSet: {send_email_types: [sendingType]}});
      } else {
          history = {
              item_id: itemId,
              item_type: itemType,
              send_email_types: [sendingType]
          };
          history = new DB.emailHistories(history);
          history = await history.save()
      }
      return {email_history: history}
  } else {
      return Promise.reject(new Error("Item type not valid"))
  }
};

const sendEmail = (data, attachment) => ({success: true});

// this give the text of the email
// this will call the order api to get the deatils of the order if its not present
// it will return a null value as response
const getFormattedDataForEmail = (itemId, itemType, attachment) => {
    if (attachment) {
        return "Normal text"
    } else {
        return "Normal text- will send the attachment soon"
    }
};

const getEmailHistoryForAnItem = async (itemId, itemType) => {
    const history = await DB.emailHistories.findOne({item_id: itemId, item_type: itemType}).lean();
    if (history) {
        history.has_send_attachment = history.send_email_types.indexOf(sendEmailTypes[0]) > -1;
        return {
            email_history: history
        }
    }
    return {email_history: null}
};

module.exports = {
    processEmailForItem: processEmailForItem,
    getEmailHistoryForAnItem: getEmailHistoryForAnItem,
};