const requestPromise = require("request-promise");

const DB = require("../configs/database");
const MS = require("../configs/config").MicroServices;

const sendEmailTypes = ["WITH-A", "WITHOUT-A"];

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
  const data = getFormattedDataForEmail(itemId, itemType);
  if (data) {
      const response = await sendEmail(data, attachment);
      if (!response.success) {
          return {email_history: null}
      }

      const sendingType = attachment ? sendEmailTypes[0] : sendEmailTypes[1]

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

const getFormattedDataForEmail = (item_id, item_type) => ({text: "sfsdfsfsd"});

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
    createEmailHistoryAndSendMail: createEmailHistoryAndSendMail
};