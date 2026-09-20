# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.


class GatewayError(Exception):
    pass


class NoModelAssigned(GatewayError):
    pass


class ModelUnavailable(GatewayError):
    pass


class ProviderNotConfigured(GatewayError):
    pass


class ProviderCallFailed(GatewayError):
    pass
