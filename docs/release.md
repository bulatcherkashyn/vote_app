# Overview
CI is configured to create builds from every stage/release tag, applied for `master` or `release` branch.
Thus for creating a docker build it is just needed to create and push a tag. 

# Tags policy
## Stage
Stage builds are used for regular updates of dev/stage servers. There can be many stages every day, so stage must include prefix `stage-` + unixtime: 
`stage-(YEAR+MONTH+DAY+HOUR+MINUTE+SECOND)`
Use the following script to create a stage tag:
```shell script
git tag stage-$(date +%y%m%d%H%M%S)
```

## Release Candidate
Release candidate is created, when everything is ready for a large release and it is needed to do some tests. Release candidate must include prefix `release-` + version + release-candidate-number:
Use the following script example to create a RC tag:
```shell script
git tag release-1.0.0-rc1
```

## Release
Release is created, when everything is ready for a release. Release must include prefix `release-` + version:
Use the following script example to create a release tag:
```shell script
git tag release-1.0.0
```

## Launch build
Once created the tag must be published. PAY ATTENTION - tags for iviche-front and iviche-back must have same names for consistency.

Find all tags with the following script:
```shell script
git tag -l
```

Publish the tag by pushing it to git and CI will create a build.
```shell script
git push origin <tag-name>
```
