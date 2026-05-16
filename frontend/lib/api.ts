import type {
  RoomAccessRequest,
  RoomAccessResponse,
  RoomCreateRequest,
  RoomMetadataResponse,
  RoomSettingsRequest,
  RoomSnapshot
} from "@codeshare/shared";

import { siteConfig } from "./site";

class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${siteConfig.apiUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    let message = "Request failed.";

    try {
      const body = (await response.json()) as { message?: string };
      message = body.message ?? message;
    } catch {
      message = response.statusText || message;
    }

    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function getRoomMetadata(slug: string) {
  return request<RoomMetadataResponse>(`/api/rooms/${slug}/metadata`);
}

export function createRoom(slug: string, payload: RoomCreateRequest) {
  return request<RoomAccessResponse>(`/api/rooms/${slug}/create`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function accessRoom(slug: string, payload: RoomAccessRequest) {
  return request<RoomAccessResponse>(`/api/rooms/${slug}/access`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function updateRoomSettings(slug: string, payload: RoomSettingsRequest, ownerToken: string) {
  return request<{ room: RoomSnapshot }>(`/api/rooms/${slug}/settings`, {
    method: "PATCH",
    headers: {
      "x-owner-token": ownerToken
    },
    body: JSON.stringify(payload)
  });
}

export function deleteRoom(slug: string, ownerToken: string) {
  return request<void>(`/api/rooms/${slug}`, {
    method: "DELETE",
    headers: {
      "x-owner-token": ownerToken
    }
  });
}

export { ApiError };
