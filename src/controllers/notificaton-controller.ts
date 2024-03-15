import { Request, Response } from "express";

import NotificationModel from "../domain/models/notification-model";
import { network_error, network_success, server_error } from "../middlewares/network-middleware";
import { ERROR_CODES } from "../shared/constants/ERROR_CODES";

export default class CitationController {
  public async create(request: Request, response: Response) {
    try {
      const notificationType = request.headers.notificationType 
      const messageFrom = request.headers.messageFrom
      const originId = request.headers.originId
      const image = request.headers.image
      const userId = request.headers.userId
      const body = request.headers.body

      if (notificationType === ('Case Requirement' || 'Case Accepted' || 'Case Rejected' || 'Case Updated' || 'Case Finished')) {
        const newNotification = new NotificationModel({
          origin_id: originId,
          user_id: userId,
          title: notificationType,
          image: image,
          body: body,
          viewed: false,
        })

        await newNotification.save()

        return network_success(newNotification, 200, response, 'Notification succesfully created')

      } else if (notificationType === 'New Mesage') {
        const newNotification = new NotificationModel({
          origin_id: originId,
          user_id: userId,
          title: `Lawyer ${messageFrom}`,
          image: image,
          body: body,
          viewed: false,
        })

        await newNotification.save()

        return network_success(newNotification, 200, response, 'Notification succesfully created')
        
      }
    } catch (error) {
      return server_error(500, response, error)
    }
  }

  public async getAllNotifications(request: Request, response: Response) {
    try {
      const userId = request.headers.userId
      const userNotifications = await NotificationModel.find({user_id: userId})

      if (!userNotifications) {
        return network_success('', 200, response, 'There is no notifications yet')
      } else {
        return network_success(userNotifications, 200, response, 'Notifications founded')
      }

    } catch (error) {
      return server_error(500, response, error)
    }
  }

  public async viewedNotifications(request: Request, response: Response) {
    try {
      const originId = request.headers.originId

      if (!originId) {
        return network_error('', 400, response, 'No notification founded', ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)

      } else {
        const notification = await NotificationModel.findOneAndUpdate({origin_id: originId}, {viewed: true}, {new: true})

        return network_success(notification, 200, response)
      }

    } catch (error) {
      server_error(500, response, error)
    }
  }
}