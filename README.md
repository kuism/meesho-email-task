# meesho-email-task

Use this create item in the quue for this micro service 

curl -X POST \
  https://meesho-task-queue.firebaseio.com/email-service/tasks.json \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 70ff76ff-98ee-b1df-e852-f07f76043d45' \
  -d '{
	"channel":"create-order",
	"order_id": "82"
}'
