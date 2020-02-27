package example;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.SQSEvent;
import com.amazonaws.services.lambda.runtime.events.SQSEvent.SQSMessage;

import software.amazon.awssdk.services.lambda.model.GetAccountSettingsRequest;
import software.amazon.awssdk.services.lambda.model.GetAccountSettingsResponse;
import software.amazon.awssdk.services.lambda.model.ServiceException;
import software.amazon.awssdk.services.lambda.LambdaAsyncClient;
import software.amazon.awssdk.services.lambda.model.AccountUsage;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
 
import java.lang.StringBuilder;
import java.util.Map;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public class Handler implements RequestHandler<SQSEvent, String>{
  private static final Logger logger = LoggerFactory.getLogger(Handler.class);
  Gson gson = new GsonBuilder().setPrettyPrinting().create();

  LambdaAsyncClient lambdaClient = LambdaAsyncClient.create();
  public Handler(){}
  // example.Handler::handleRequest
  @Override
  public String handleRequest(SQSEvent event, Context context)
  {
    // call Lambda API
    logger.info("Getting account settings");
    CompletableFuture<GetAccountSettingsResponse> accountSettings = 
        lambdaClient.getAccountSettings(GetAccountSettingsRequest.builder().build());
    // log execution details
    logger.info("ENVIRONMENT VARIABLES: " + gson.toJson(System.getenv()));
    logger.info("CONTEXT: " + gson.toJson(context));
    // process event
    logger.info("EVENT: " + gson.toJson(event));
    for(SQSMessage msg : event.getRecords()){
      logger.info(msg.getBody());
    }

    try {
      GetAccountSettingsResponse settings = accountSettings.get();
      logger.info("Account usage:" + gson.toJson(settings.accountUsage()));
    } catch(Exception e) {
      e.getStackTrace();
    }
    return context.getAwsRequestId();
  }
}