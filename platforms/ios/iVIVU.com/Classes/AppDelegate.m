/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

//
//  AppDelegate.m
//  iVIVU.com
//
//  Created by ___FULLUSERNAME___ on ___DATE___.
//  Copyright ___ORGANIZATIONNAME___ ___YEAR___. All rights reserved.
//

#import "AppDelegate.h"
#import "MainViewController.h"
#import "Firebase.h"
#import "FirebaseMessaging.h"
#import "FCMPlugin.h"

@implementation AppDelegate

static NSData *lastPush;

- (BOOL)application:(UIApplication*)application didFinishLaunchingWithOptions:(NSDictionary*)launchOptions
{
    self.viewController = [[MainViewController alloc] init];
    NSString *CUSTOM_URL_SCHEME =@"https://ivivudownload.page.link/iviviapp";
    
    NSURL *link = [[NSURL alloc] initWithString:@"https://ivivudownload.page.link/ivivuapp"];
    NSString *dynamicLinksDomainURIPrefix = @"https://ivivudownload.page.link/ivivuapp";
    FIRDynamicLinkComponents *linkBuilder = [[FIRDynamicLinkComponents alloc]
                                             initWithLink:link
                                             domainURIPrefix:dynamicLinksDomainURIPrefix];
    linkBuilder.iOSParameters = [[FIRDynamicLinkIOSParameters alloc]
                                 initWithBundleID:@"com.ivivu.oliviaapp2019"];
    linkBuilder.iOSParameters.appStoreID = @"1464844301";
    
    [FIROptions defaultOptions].deepLinkURLScheme = dynamicLinksDomainURIPrefix;
    [FIRApp configure];
    [FIRMessaging messaging].autoInitEnabled = YES;
    [FIRMessaging messaging].delegate = self;
    [[FIRInstanceID instanceID] instanceIDWithHandler:^(FIRInstanceIDResult * _Nullable result,
                                                        NSError * _Nullable error) {
        if (error != nil) {
            NSLog(@"Error fetching remote instance ID: %@", error);
        } else {
            NSLog(@"Remote instance ID token: %@", result.token);
            NSString* message =
            [NSString stringWithFormat:@"Remote InstanceID token: %@", result.token];
            //self.instanceIDTokenMessage.text = message;
            NSLog(result.token);
        }
    }];
    if ([UNUserNotificationCenter class] != nil) {
        // iOS 10 or later
        // For iOS 10 display notification (sent via APNS)
        [UNUserNotificationCenter currentNotificationCenter].delegate = self;
        UNAuthorizationOptions authOptions = UNAuthorizationOptionAlert |
        UNAuthorizationOptionSound | UNAuthorizationOptionBadge;
        [[UNUserNotificationCenter currentNotificationCenter]
         requestAuthorizationWithOptions:authOptions
         completionHandler:^(BOOL granted, NSError * _Nullable error) {
             // ...
         }];
    } else {
        // iOS 10 notifications aren't available; fall back to iOS 8-9 notifications.
        UIUserNotificationType allNotificationTypes =
        (UIUserNotificationTypeSound | UIUserNotificationTypeAlert | UIUserNotificationTypeBadge);
        UIUserNotificationSettings *settings =
        [UIUserNotificationSettings settingsForTypes:allNotificationTypes categories:nil];
        [application registerUserNotificationSettings:settings];
    }
    
    [application registerForRemoteNotifications];
    
    
    
    return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (void)messaging:(FIRMessaging *)messaging didReceiveRegistrationToken:(NSString *)fcmToken {
    NSLog(@"FCM registration token: %@", fcmToken);
    // Notify about received token.
    NSDictionary *dataDict = [NSDictionary dictionaryWithObject:fcmToken forKey:@"token"];
    [[NSNotificationCenter defaultCenter] postNotificationName:
     @"FCMToken" object:nil userInfo:dataDict];
    // TODO: If necessary send token to application server.
    // Note: This callback is fired at each app startup and whenever a new token is generated.
}

- (void)openScheme:(NSString *)scheme {
    UIApplication *application = [UIApplication sharedApplication];
    NSURL *URL = [NSURL URLWithString:scheme];
    
    if ([application respondsToSelector:@selector(openURL:options:completionHandler:)]) {
        [application openURL:URL options:@{}
           completionHandler:^(BOOL success) {
               NSLog(@"Open %@: %d",scheme,success);
           }];
    } else {
        BOOL success = [application openURL:URL];
        NSLog(@"Open %@: %d",scheme,success);
    }
}

// Handle incoming notification messages while app is in the foreground.
//- (void)userNotificationCenter:(UNUserNotificationCenter *)center
    //   willPresentNotification:(UNNotification *)notification
    //     withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler {
    //NSDictionary *userInfo = notification.request.content.userInfo;
    
    // With swizzling disabled you must let Messaging know about the message, for Analytics
    // [[FIRMessaging messaging] appDidReceiveMessage:userInfo];
    
    // Print message ID.
    
    // Print full message.
    //NSLog(@"%@", userInfo);
    //NSLog(@"app in foreground");
    //NSError *error;
    //NSDictionary *userInfoMutable = [userInfo mutableCopy];
    
    //[userInfoMutable setValue:@(YES) forKey:@"wasTapped"];
    
    //NSData *jsonData = [NSJSONSerialization dataWithJSONObject:userInfoMutable
    //                                                   options:0
    //                                                     error:&error];
    //NSLog(@"APP WAS CLOSED DURING PUSH RECEPTION Saved data: %@", jsonData);
    //lastPush = jsonData;
    //if (lastPush != nil) {
    //    [FCMPlugin.fcmPlugin notifyOfMessage:lastPush];
    //}
    // Change this to your preferred presentation option
    //completionHandler(UNNotificationPresentationOptionNone);
//}

// Handle notification messages after display notification is tapped by the user.
//- (void)userNotificationCenter:(UNUserNotificationCenter *)center
//didReceiveNotificationResponse:(UNNotificationResponse *)response
//         withCompletionHandler:(void(^)(void))completionHandler {
//    NSDictionary *userInfo = response.notification.request.content.userInfo;
    
//    completionHandler();
//}

// Handle incoming notification messages while app is in the foreground.
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
       willPresentNotification:(UNNotification *)notification
         withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler {
    // Print message ID.
    NSDictionary *userInfo = notification.request.content.userInfo;
    //if (userInfo[kGCMMessageIDKey]) {
    //    NSLog(@"Message ID 1: %@", userInfo[kGCMMessageIDKey]);
    //}
    
    // Print full message.
    NSLog(@"%@", userInfo);
    
    NSError *error;
    NSDictionary *userInfoMutable = [userInfo mutableCopy];
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:userInfoMutable
                                                       options:0
                                                         error:&error];
    //    if (firstLocalPush == false){
    //        [FCMPlugin.fcmPlugin notifyOfMessage:jsonData];
    //        firstLocalPush = true;
    //    }
    
    if ([userInfo objectForKey:@"id"]){
        // Change this to your preferred presentation option
        [[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
        [[UIApplication sharedApplication] cancelAllLocalNotifications];
        completionHandler(UNNotificationPresentationOptionSound | UNNotificationPresentationOptionBadge | UNNotificationPresentationOptionAlert);
        
    } else{
        [FCMPlugin.fcmPlugin notifyOfMessage:jsonData];
    }
}

// Handle notification messages after display notification is tapped by the user.
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void (^)())completionHandler {
    NSDictionary *userInfo = response.notification.request.content.userInfo;
    //if (userInfo[kGCMMessageIDKey]) {
    //    NSLog(@"Message ID 2: %@", userInfo[kGCMMessageIDKey]);
    //}
    
    // Print full message.
    NSLog(@"aaa%@", userInfo);
    
    NSError *error;
    NSDictionary *userInfoMutable = [userInfo mutableCopy];
    
    
    NSLog(@"New method with push callback: %@", userInfo);
    
    [userInfoMutable setValue:@(YES) forKey:@"wasTapped"];
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:userInfoMutable
                                                       options:0
                                                         error:&error];
    NSLog(@"APP WAS CLOSED DURING PUSH RECEPTION Saved data: %@", jsonData);
    lastPush = jsonData;
    if (lastPush != nil) {
        [FCMPlugin.fcmPlugin notifyOfMessage:lastPush];
    }
    
    
    //    completionHandler();
}

- (void)application:(UIApplication *)application
didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
    [FIRMessaging messaging].APNSToken = deviceToken;
    NSLog(@"Token: %@", deviceToken);
}

+(NSData*)getLastPush
{
    NSData* returnValue = lastPush;
    lastPush = nil;
    return returnValue;
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
{
    // Short-circuit when actually running iOS 10+, let notification centre methods handle the notification.
    if (NSFoundationVersionNumber >= NSFoundationVersionNumber_iOS_9_x_Max) {
        return;
    }
    
    NSLog(@"Message ID: %@", userInfo[@"gcm.message_id"]);
    
    NSError *error;
    NSDictionary *userInfoMutable = [userInfo mutableCopy];
    
    if (application.applicationState != UIApplicationStateActive) {
        NSLog(@"New method with push callback: %@", userInfo);
        
        [userInfoMutable setValue:@(YES) forKey:@"wasTapped"];
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:userInfoMutable
                                                           options:0
                                                             error:&error];
        NSLog(@"APP WAS CLOSED DURING PUSH RECEPTION Saved data: %@", jsonData);
        NSData* lastPush = [AppDelegate getLastPush];
        if (lastPush != nil) {
            [FCMPlugin.fcmPlugin notifyOfMessage:lastPush];
        }
        lastPush = jsonData;
    }
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
    // Short-circuit when actually running iOS 10+, let notification centre methods handle the notification.
    if (NSFoundationVersionNumber >= NSFoundationVersionNumber_iOS_9_x_Max) {
        return;
    }
    
    // If you are receiving a notification message while your app is in the background,
    // this callback will not be fired till the user taps on the notification launching the application.
    // TODO: Handle data of notification
    
    // Print message ID.
    NSLog(@"Message ID: %@", userInfo[@"gcm.message_id"]);
    
    // Pring full message.
    NSLog(@"%@", userInfo);
    NSError *error;
    
    NSDictionary *userInfoMutable = [userInfo mutableCopy];
    
    // Has user tapped the notificaiton?
    // UIApplicationStateActive   - app is currently active
    // UIApplicationStateInactive - app is transitioning from background to
    //                              foreground (user taps notification)
    
    UIApplicationState state = application.applicationState;
    if (application.applicationState == UIApplicationStateActive
        || application.applicationState == UIApplicationStateInactive) {
        [userInfoMutable setValue:@(NO) forKey:@"wasTapped"];
        NSLog(@"app active");
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:userInfoMutable
                                                           options:0
                                                             error:&error];
        [FCMPlugin.fcmPlugin notifyOfMessage:jsonData];
        
        // app is in background
    }
    
    completionHandler(UIBackgroundFetchResultNoData);
}


@end
