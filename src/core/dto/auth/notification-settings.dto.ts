import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, ValidateNested } from "class-validator";

class NotificationSettingsKeysDto {
  @ApiProperty({
    required: true,
    description: "p256dh Token",
    example: "BL7ELU24fJTAlH5Kyl8N6BDCac8u8li_",
  })
  @IsNotEmpty()
  p256dh: string;

  @ApiProperty({
    required: true,
    description: "auth Token",
    example: "BL7ELU24fJTAlH5Kyl8N6BDCac8u8li_",
  })
  @IsNotEmpty()
  auth: string;
}

export class NotificationSettingsDto {
  @ApiProperty({
    required: true,
    description: "The endpoint of pusher service",
    example: "https://fcm.google.com/token",
  })
  @IsNotEmpty()
  endpoint: string;

  @ApiProperty({
    description: "Null or time of expiration",
    example: "null",
  })
  @IsOptional()
  expirationTime;

  @ValidateNested()
  keys: NotificationSettingsKeysDto;
}
