import {App, Stack} from '@aws-cdk/core';
import {expect as expectCDK, haveResource} from '@aws-cdk/assert';
import {StaticWebsite} from '../lib/static-website';
import {join} from 'path';

test('Static Website', () => {
  // WHEN
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '12345',
      region: 'us-east-1'
    },
  });
  new StaticWebsite(stack, 'StaticWebsite', {
    hostedZone: 'example.com',
    domainName: 'test.example.com',
    artifactSourcePath: join(__dirname, 'dist'),
  });
  // THEN
  expectCDK(stack).to(haveResource('AWS::S3::Bucket'));
  expectCDK(stack).to(haveResource('AWS::CloudFront::Distribution', {
    "DistributionConfig": {
      "Aliases": [
        "test.example.com"
      ],
      "CustomErrorResponses": [],
      "DefaultCacheBehavior": {
        "AllowedMethods": [
          "GET",
          "HEAD",
          "OPTIONS"
        ],
        "CachedMethods": [
          "GET",
          "HEAD"
        ],
        "Compress": true,
        "ForwardedValues": {
          "Cookies": {
            "Forward": "none"
          },
          "QueryString": false
        },
        "TargetOriginId": "origin1",
        "ViewerProtocolPolicy": "redirect-to-https"
      },
      "DefaultRootObject": "index.html",
      "Enabled": true,
      "HttpVersion": "http2",
      "IPV6Enabled": true,
      "Origins": [
        {
          "DomainName": {
            "Fn::GetAtt": [
              "StaticWebsiteBucket0E92E0FC",
              "RegionalDomainName"
            ]
          },
          "Id": "origin1",
          "S3OriginConfig": {
            "OriginAccessIdentity": {
              "Fn::Join": [
                "",
                [
                  "origin-access-identity/cloudfront/",
                  {
                    "Ref": "StaticWebsiteOAI6BBF1C76"
                  }
                ]
              ]
            }
          }
        }
      ],
      "PriceClass": "PriceClass_100",
      "ViewerCertificate": {
        "AcmCertificateArn": {
          "Fn::GetAtt": [
            "StaticWebsiteCertificateCertificateRequestorResource7C29CEF3",
            "Arn"
          ]
        },
        "SslSupportMethod": "sni-only"
      }
    }
  }));
  expectCDK(stack).to(haveResource('AWS::Route53::RecordSet', {
    "Name": "test.example.com.",
    "Type": "A",
    "AliasTarget": {
      "DNSName": {
        "Fn::GetAtt": [
          "StaticWebsiteSWCFDistributionBD416E85",
          "DomainName"
        ]
      },
      "HostedZoneId": "Z2FDTNDATAQYW2"
    },
    "HostedZoneId": "/hostedzone/DUMMY"
  }));
  expectCDK(stack).to(haveResource('AWS::Route53::RecordSet', {
    "Name": "test.example.com.",
    "Type": "AAAA",
    "AliasTarget": {
      "DNSName": {
        "Fn::GetAtt": [
          "StaticWebsiteSWCFDistributionBD416E85",
          "DomainName"
        ]
      },
      "HostedZoneId": "Z2FDTNDATAQYW2"
    },
    "HostedZoneId": "/hostedzone/DUMMY"
  }));
});
